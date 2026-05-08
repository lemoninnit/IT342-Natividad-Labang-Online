package edu.cit.natividad.labangonline.features.admin;

import edu.cit.natividad.labangonline.shared.dto.RequestDTO;
import edu.cit.natividad.labangonline.shared.dto.ResponseDTO;
import edu.cit.natividad.labangonline.shared.factory.RequestStrategyFactory;
import edu.cit.natividad.labangonline.shared.strategy.RequestProcessingStrategy;
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
