package com.church.church_backend;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // ─── Preflight ───────────────────────────────────────
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ─── Public reads (no auth needed) ───────────────────
                .requestMatchers(HttpMethod.GET, "/api/members", "/api/events").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/gallery", "/api/gallery/files/**").permitAll()

                // 📰 News — public reads (list, documents, images)
                .requestMatchers(HttpMethod.GET,
                        "/api/news",
                        "/api/news/files/**",
                        "/api/news/images/**")
                    .permitAll()

                // 👥 Leaders — public reads (list, photos, videos)   ← NEW
                .requestMatchers(HttpMethod.GET,
                        "/api/leaders",
                        "/api/leaders/photos/**",
                        "/api/leaders/videos/**")
                    .permitAll()

                // ─── Public deanery information reads ─────────────────
                // Public website can display deaneries, parishes, priests, Mass times and events.
                // All POST/PUT/DELETE operations for these resources are restricted below.
                .requestMatchers(HttpMethod.GET, "/api/deaneries", "/api/deaneries/**",
                        "/api/parishes", "/api/parishes/**", "/api/priests", "/api/priests/**",
                        "/api/mass-times", "/api/mass-times/**", "/api/deanery-events", "/api/deanery-events/**")
                    .permitAll()

                // ─── Auth (login / register) ─────────────────────────
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/parishes").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()

                // ─── System-admin account management ─────────────────
                .requestMatchers("/api/system-admin/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")

                // ─── Deanery administration: system admin only ────────
                // These write rules follow public GET rules, so only reads are public.
                .requestMatchers(HttpMethod.POST, "/api/deaneries", "/api/deaneries/**",
                        "/api/parishes", "/api/parishes/**", "/api/priests", "/api/priests/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/parishes", "/api/parishes/**")
                    .hasAnyAuthority("ROLE_SYSTEM_ADMIN", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/deaneries", "/api/deaneries/**",
                        "/api/priests", "/api/priests/**",
                        "/api/mass-times/**", "/api/deanery-events/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/deaneries", "/api/deaneries/**",
                        "/api/parishes", "/api/parishes/**", "/api/priests", "/api/priests/**",
                        "/api/mass-times/**", "/api/deanery-events/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/parishes/*/mass-times", "/api/deaneries/*/events", "/api/deanery-events/**", "/api/mass-times/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/deaneries/**", "/api/parishes/**", "/api/priests/**", "/api/mass-times/**", "/api/deanery-events/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")

                // ─── Files ───────────────────────────────────────────
                .requestMatchers("/api/files/**").permitAll()

                // ─── System Admin only ───────────────────────────────
                .requestMatchers("/api/auth/pending", "/api/auth/approve/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")

                // ─── Admin writes: Members / Events / Attendance ─────
                .requestMatchers(HttpMethod.POST, "/api/members/**", "/api/events/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")
                .requestMatchers("/api/attendance/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")

                // ─── Gallery writes ──────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/gallery/upload")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/gallery/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")

                // ─── News writes ─────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/news", "/api/news/upload")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/news/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")

                // ─── Leaders writes                                ← NEW
                .requestMatchers(HttpMethod.POST, "/api/leaders", "/api/leaders/upload")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/leaders/**")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_SYSTEM_ADMIN")

                // ─── Everything else ─────────────────────────────────
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ─── CORS ────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://localhost:4173"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        configuration.setAllowedHeaders(List.of(
            "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"
        ));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}