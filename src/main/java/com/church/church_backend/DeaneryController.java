
package com.church.church_backend;

import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deaneries")
public class DeaneryController {

    private final DeaneryRepository deaneries;
    private final ParishRepository parishes;
    private final PriestRepository priests;
    private final DeaneryEventRepository events;
    private final EntityManager entityManager;

    public DeaneryController(
            DeaneryRepository deaneries,
            ParishRepository parishes,
            PriestRepository priests,
            DeaneryEventRepository events,
            EntityManager entityManager) {

        this.deaneries = deaneries;
        this.parishes = parishes;
        this.priests = priests;
        this.events = events;
        this.entityManager = entityManager;
    }

    // PRINT THE DATABASE FILE USED BY THE RUNNING APPLICATION
    private void printDatabaseLocation() {
        try {
            List<?> databases = entityManager
                    .createNativeQuery("PRAGMA database_list")
                    .getResultList();

            System.out.println();
            System.out.println("========== DATABASE LOCATION ==========");

            for (Object row : databases) {
                Object[] columns = (Object[]) row;

                System.out.println("Database name: " + columns[1]);
                System.out.println("Database path: " + columns[2]);
            }

            System.out.println("=======================================");
            System.out.println();

        } catch (Exception e) {
            System.out.println(
                    "Could not determine database location: "
                            + e.getMessage()
            );
        }
    }

    // GET ALL DEANERIES
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list() {

        printDatabaseLocation();

        List<Map<String, Object>> result =
                deaneries.findAllByOrderByNameAsc()
                        .stream()
                        .map(deanery -> {
                            Map<String, Object> data = dto(deanery);

                            data.put(
                                    "parishCount",
                                    parishes.findByDeaneryId(
                                            deanery.getId()
                                    ).size()
                            );

                            return data;
                        })
                        .collect(Collectors.toList());

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(result);
    }

    // GET ONE DEANERY
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {

        Optional<Deanery> found = deaneries.findById(id);

        if (found.isEmpty()) {
            return error(
                    HttpStatus.NOT_FOUND,
                    "Deanery not found"
            );
        }

        Deanery deanery = found.get();

        Map<String, Object> result = dto(deanery);

        List<Parish> parishList =
                parishes.findByDeaneryId(id);

        result.put("parishCount", parishList.size());

        result.put(
                "parishes",
                parishList.stream()
                        .map(this::parishDto)
                        .collect(Collectors.toList())
        );

        result.put(
                "dean",
                deanery.getDeanId() == null
                        ? null
                        : priests.findById(deanery.getDeanId())
                                .map(this::priestDto)
                                .orElse(null)
        );

        result.put(
                "viceDean",
                deanery.getViceDeanId() == null
                        ? null
                        : priests.findById(deanery.getViceDeanId())
                                .map(this::priestDto)
                                .orElse(null)
        );

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(result);
    }

    // CREATE DEANERY
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Deanery input) {

        if (input.getName() == null
                || input.getName().isBlank()) {

            return error(
                    HttpStatus.BAD_REQUEST,
                    "Deanery name is required"
            );
        }

        String slug = createSlug(input.getName());

        if (slug.isBlank()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "A valid deanery name is required"
            );
        }

        if (deaneries.existsBySlug(slug)) {
            return error(
                    HttpStatus.CONFLICT,
                    "A deanery with this name already exists"
            );
        }

        input.setName(input.getName().trim());
        input.setSlug(slug);

        Deanery saved = deaneries.save(input);

        return ResponseEntity.status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore())
                .body(dto(saved));
    }

    // UPDATE DEANERY
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Deanery input) {

        Optional<Deanery> found = deaneries.findById(id);

        if (found.isEmpty()) {
            return error(
                    HttpStatus.NOT_FOUND,
                    "Deanery not found"
            );
        }

        if (input.getName() == null
                || input.getName().isBlank()) {

            return error(
                    HttpStatus.BAD_REQUEST,
                    "Deanery name is required"
            );
        }

        Deanery existing = found.get();
        String slug = createSlug(input.getName());

        if (slug.isBlank()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "A valid deanery name is required"
            );
        }

        boolean slugUsedByAnotherDeanery =
                deaneries.existsBySlug(slug)
                        && !slug.equals(existing.getSlug());

        if (slugUsedByAnotherDeanery) {
            return error(
                    HttpStatus.CONFLICT,
                    "Another deanery already uses this name"
            );
        }

        existing.setName(input.getName().trim());
        existing.setSlug(slug);
        existing.setDescription(input.getDescription());
        existing.setTerritory(input.getTerritory());
        existing.setDeanId(input.getDeanId());
        existing.setViceDeanId(input.getViceDeanId());
        existing.setArchdioceseId(input.getArchdioceseId());

        existing.setStatus(
                input.getStatus() == null
                        || input.getStatus().isBlank()
                        ? "ACTIVE"
                        : input.getStatus()
        );

        Deanery saved = deaneries.save(existing);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(dto(saved));
    }

    // DELETE DEANERY
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {

        printDatabaseLocation();

        System.out.println();
        System.out.println("========== DEANERY DELETE DEBUG ==========");
        System.out.println("Requested deanery ID: " + id);

        List<Deanery> allDeaneries =
                deaneries.findAllByOrderByNameAsc();

        System.out.println("Deaneries currently in database:");

        allDeaneries.forEach(deanery ->
                System.out.println(
                        "ID: " + deanery.getId()
                                + ", Name: " + deanery.getName()
                )
        );

        Optional<Deanery> found = deaneries.findById(id);

        System.out.println(
                "Found requested deanery: " + found.isPresent()
        );

        if (found.isEmpty()) {
            System.out.println("RESULT: Deanery not found.");
            System.out.println("==========================================");

            return error(
                    HttpStatus.NOT_FOUND,
                    "Deanery not found"
            );
        }

        List<Parish> parishList =
                parishes.findByDeaneryId(id);

        if (!parishList.isEmpty()) {
            System.out.println(
                    "RESULT: Cannot delete. Parish count: "
                            + parishList.size()
            );

            System.out.println("==========================================");

            return error(
                    HttpStatus.CONFLICT,
                    "Cannot delete this deanery while it has parishes. "
                            + "Reassign or delete its parishes first."
            );
        }

        // Delete associated events first.
        events.findByDeaneryId(id)
                .forEach(events::delete);

        // Delete the deanery.
        deaneries.delete(found.get());
        deaneries.flush();

        System.out.println("RESULT: Deanery deleted successfully.");
        System.out.println("==========================================");

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of(
                        "message", "Deanery deleted successfully",
                        "id", id
                ));
    }

    // CONVERT DEANERY TO RESPONSE DATA
    private Map<String, Object> dto(Deanery deanery) {

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("id", deanery.getId());
        result.put("name", deanery.getName());
        result.put("slug", deanery.getSlug());
        result.put("description", deanery.getDescription());
        result.put("territory", deanery.getTerritory());
        result.put("deanId", deanery.getDeanId());
        result.put("viceDeanId", deanery.getViceDeanId());
        result.put("archdioceseId", deanery.getArchdioceseId());

        result.put(
                "status",
                deanery.getStatus() == null
                        ? "ACTIVE"
                        : deanery.getStatus()
        );

        return result;
    }

    // CONVERT PARISH TO RESPONSE DATA
    private Map<String, Object> parishDto(Parish parish) {

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("id", parish.getId());
        result.put("name", parish.getName());
        result.put("slug", parish.getSlug());

        return result;
    }

    // CONVERT PRIEST TO RESPONSE DATA
    private Map<String, Object> priestDto(Priest priest) {

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("id", priest.getId());
        result.put("name", priest.getName());

        return result;
    }

    // GENERATE A URL-FRIENDLY SLUG
    private String createSlug(String value) {

        if (value == null) {
            return "";
        }

        return Normalizer.normalize(
                        value.trim(),
                        Normalizer.Form.NFD
                )
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    // STANDARD ERROR RESPONSE
    private ResponseEntity<Map<String, Object>> error(
            HttpStatus status,
            String message) {

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("message", message);
        body.put("status", status.value());

        return ResponseEntity.status(status)
                .cacheControl(CacheControl.noStore())
                .body(body);
    }
}
