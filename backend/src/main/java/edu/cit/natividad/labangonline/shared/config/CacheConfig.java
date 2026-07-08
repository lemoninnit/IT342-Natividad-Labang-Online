package edu.cit.natividad.serviline.shared.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.Arrays;

@Configuration
@EnableCaching
@EnableAsync
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(Arrays.asList(
            "userRequests",
            "userComplaints",
            "announcements",
            "paymentByCertRequest",
            "users",
            "allCertificateRequests",
            "allComplaints",
            "allUsers"
        ));
        return cacheManager;
    }
}
