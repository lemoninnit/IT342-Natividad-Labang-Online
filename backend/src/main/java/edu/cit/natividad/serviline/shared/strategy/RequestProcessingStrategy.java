package edu.cit.natividad.serviline.shared.strategy;

import edu.cit.natividad.serviline.shared.dto.RequestDTO;
import edu.cit.natividad.serviline.shared.dto.ResponseDTO;

public interface RequestProcessingStrategy {
    boolean supports(String serviceType);
    ResponseDTO process(RequestDTO requestDto);
}
