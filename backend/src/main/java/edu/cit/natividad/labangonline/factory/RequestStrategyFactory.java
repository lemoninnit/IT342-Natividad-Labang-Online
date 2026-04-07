package edu.cit.natividad.labangonline.factory;

import edu.cit.natividad.labangonline.strategy.RequestProcessingStrategy;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RequestStrategyFactory {

    private final List<RequestProcessingStrategy> strategies;

    public RequestStrategyFactory(List<RequestProcessingStrategy> strategies) {
        this.strategies = strategies;
    }

    public RequestProcessingStrategy getStrategy(String serviceType) {
        return strategies.stream()
                .filter(strategy -> strategy.supports(serviceType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported service type: " + serviceType));
    }
}