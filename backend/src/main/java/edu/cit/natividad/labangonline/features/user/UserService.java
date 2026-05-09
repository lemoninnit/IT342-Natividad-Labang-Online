package edu.cit.natividad.labangonline.features.user;

import org.springframework.stereotype.Service;
import edu.cit.natividad.labangonline.features.user.User;
import edu.cit.natividad.labangonline.features.user.UserRepository;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setMiddleName(updatedUser.getMiddleName());
            user.setLastName(updatedUser.getLastName());
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setDob(updatedUser.getDob());
            user.setCivilStatus(updatedUser.getCivilStatus());
            user.setStreet(updatedUser.getStreet());
            user.setPurok(updatedUser.getPurok());
            user.setBarangay(updatedUser.getBarangay());
            user.setCity(updatedUser.getCity());
            user.setProvince(updatedUser.getProvince());
            user.setPostalCode(updatedUser.getPostalCode());
            user.setResidentIdUrl(updatedUser.getResidentIdUrl());
            user.setProfilePicture(updatedUser.getProfilePicture());
            user.setResidentIdImage(updatedUser.getResidentIdImage());
            // Role and residentConfirmed should only be changed by admin, keeping current values
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
