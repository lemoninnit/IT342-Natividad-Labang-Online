package edu.cit.natividad.labangonline.request;

public class RequestDTO {
    private String serviceType; // e.g., "CERTIFICATE", "COMPLAINT"
    private String purpose;     // Used for certificates
    private String location;    // Used for complaints

    // Getters and Setters
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}