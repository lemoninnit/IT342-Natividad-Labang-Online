package edu.cit.natividad.labangonline.request;

import edu.cit.natividad.labangonline.factory.RequestStrategyFactory;
import edu.cit.natividad.labangonline.strategy.RequestProcessingStrategy;
import org.springframework.stereotype.Service;

@Service
public class ServiceRequestService {

    private final RequestStrategyFactory strategyFactory;

    public ServiceRequestService(RequestStrategyFactory strategyFactory) {
        this.strategyFactory = strategyFactory;
    }

    public ResponseDTO processIncomingRequest(RequestDTO requestDto) {
        RequestProcessingStrategy strategy = strategyFactory.getStrategy(requestDto.getServiceType());
        return strategy.process(requestDto);
    }
}