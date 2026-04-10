 package edu.cit.natividad.labangonline.strategy;

import edu.cit.natividad.labangonline.dto.RequestDTO;
import edu.cit.natividad.labangonline.dto.ResponseDTO;

public interface RequestProcessingStrategy {
    boolean supports(String serviceType);
    ResponseDTO process(RequestDTO requestDto);
}
