package edu.cit.natividad.serviline.shared.strategy;

import edu.cit.natividad.serviline.shared.dto.RequestDTO;
import edu.cit.natividad.serviline.shared.dto.ResponseDTO;
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
