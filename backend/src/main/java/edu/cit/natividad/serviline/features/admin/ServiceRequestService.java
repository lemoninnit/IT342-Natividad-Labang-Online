package edu.cit.natividad.serviline.features.admin;

import edu.cit.natividad.serviline.shared.dto.RequestDTO;
import edu.cit.natividad.serviline.shared.dto.ResponseDTO;
import edu.cit.natividad.serviline.shared.factory.RequestStrategyFactory;
import edu.cit.natividad.serviline.shared.strategy.RequestProcessingStrategy;
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
