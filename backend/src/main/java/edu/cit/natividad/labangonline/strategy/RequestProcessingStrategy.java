 package edu.cit.natividad.labangonline.strategy;

import edu.cit.natividad.labangonline.request.RequestDTO;
import edu.cit.natividad.labangonline.request.ResponseDTO;

public interface RequestProcessingStrategy {
    boolean supports(String serviceType);
    ResponseDTO process(RequestDTO requestDto);
}
