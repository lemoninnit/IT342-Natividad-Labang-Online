package edu.cit.natividad.labangonline.strategy;

import edu.cit.natividad.labangonline.request.RequestDTO;
import edu.cit.natividad.labangonline.request.ResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ComplaintStrategy implements RequestProcessingStrategy {

    @Override
    public boolean supports(String serviceType) {
        return "COMPLAINT".equalsIgnoreCase(serviceType);
    }

    @Override
    public ResponseDTO process(RequestDTO requestDto) {
        if (requestDto.getLocation() == null || requestDto.getLocation().isEmpty()) {
            throw new IllegalArgumentException("Location is required for filing a complaint.");
        }

        // Add database logic here (e.g., repository.save())
        return new ResponseDTO(true, "Complaint successfully and securely filed.");
    }
}