package edu.cit.natividad.labangonline.strategy;

import edu.cit.natividad.labangonline.request.RequestDTO;
import edu.cit.natividad.labangonline.request.ResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class CertificateStrategy implements RequestProcessingStrategy {

    @Override
    public boolean supports(String serviceType) {
        return "CERTIFICATE".equalsIgnoreCase(serviceType);
    }

    @Override
    public ResponseDTO process(RequestDTO requestDto) {
        if (requestDto.getPurpose() == null || requestDto.getPurpose().isEmpty()) {
            throw new IllegalArgumentException("Purpose is required for certificate requests.");
        }

        // Add database logic here (e.g., repository.save())
        return new ResponseDTO(true, "Certificate request successfully submitted.");
    }
}