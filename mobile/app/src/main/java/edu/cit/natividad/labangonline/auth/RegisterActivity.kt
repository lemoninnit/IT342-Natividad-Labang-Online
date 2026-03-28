package edu.cit.natividad.labangonline.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import android.widget.ArrayAdapter
import com.google.android.material.snackbar.Snackbar
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.RegisterRequest
import edu.cit.natividad.labangonline.databinding.ActivityRegisterBinding
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private val apiService = ApiClient.getAuthService()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupGenderDropdown()

        with(binding) {
            registerButton.setOnClickListener {
                handleRegistration()
            }

            backButton.setOnClickListener {
                finish()
            }
        }
    }

    private fun setupGenderDropdown() {
        val genders = arrayOf("Male", "Female", "Other")
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, genders)
        binding.genderInput.setAdapter(adapter)
    }

    private fun handleRegistration() {
        // Get all input values
        val firstName = binding.firstNameInput.text.toString().trim()
        val lastName = binding.lastNameInput.text.toString().trim()
        val dob = binding.dobInput.text.toString().trim()
        val gender = binding.genderInput.text.toString().trim()
        val street = binding.streetInput.text.toString().trim()
        val purok = binding.purokInput.text.toString().trim()
        val phone = binding.phoneInput.text.toString().trim()
        val email = binding.emailInput.text.toString().trim()
        val password = binding.passwordInput.text.toString()
        val confirmPassword = binding.confirmPasswordInput.text.toString()

        // Validate inputs
        if (!validateInputs(firstName, lastName, dob, gender, street, purok, phone, email, password, confirmPassword)) {
            return
        }

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.registerButton.isEnabled = false
        binding.errorMessage.visibility = View.GONE
        binding.successMessage.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val request = RegisterRequest(
                    firstName = firstName,
                    lastName = lastName,
                    dob = dob,
                    gender = gender,
                    street = street,
                    purok = purok,
                    barangay = "Labangon", // Fixed as per requirements
                    city = "Cebu City", // Fixed as per requirements
                    province = "Cebu", // Fixed as per requirements
                    phone = phone,
                    email = email,
                    password = password
                )

                val response = apiService.register(request)

                when (response.status) {
                    "OK" -> {
                        showSuccessMessage("Registration successful! Redirecting to login...")
                        binding.successMessage.text = "Account created successfully!"
                        binding.successMessage.visibility = View.VISIBLE
                        
                        // Redirect to Login after 2 seconds
                        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                            startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                            finish()
                        }, 2000)
                    }
                    "EMAIL_EXISTS" -> {
                        showErrorMessage("Email already registered. Please use a different email.")
                    }
                    "PHONE_EXISTS" -> {
                        showErrorMessage("Phone number already registered. Please use a different phone.")
                    }
                    else -> {
                        showErrorMessage("Registration failed: ${response.status}")
                    }
                }
            } catch (e: Exception) {
                showErrorMessage("Error: ${e.message}")
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.registerButton.isEnabled = true
            }
        }
    }

    private fun validateInputs(
        firstName: String,
        lastName: String,
        dob: String,
        gender: String,
        street: String,
        purok: String,
        phone: String,
        email: String,
        password: String,
        confirmPassword: String
    ): Boolean {
        var isValid = true

        if (firstName.isEmpty()) {
            showErrorMessage("First name is required")
            isValid = false
        }

        if (lastName.isEmpty()) {
            showErrorMessage("Last name is required")
            isValid = false
        }

        if (dob.isEmpty()) {
            showErrorMessage("Date of birth is required")
            isValid = false
        }

        if (gender.isEmpty()) {
            showErrorMessage("Gender is required")
            isValid = false
        }

        if (street.isEmpty()) {
            showErrorMessage("Street/house number is required")
            isValid = false
        }

        if (purok.isEmpty()) {
            showErrorMessage("Purok is required")
            isValid = false
        }

        val phoneRegex = "^(09|\\+639)\\d{9}$"
        if (phone.isEmpty()) {
            showErrorMessage("Phone number is required")
            isValid = false
        } else if (!phone.replace("\\s".toRegex(), "").matches(phoneRegex.toRegex())) {
            showErrorMessage("Enter a valid Philippine mobile number (e.g., 09XXXXXXXXX)")
            isValid = false
        }

        val emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        if (email.isEmpty()) {
            showErrorMessage("Email is required")
            isValid = false
        } else if (!email.matches(emailRegex.toRegex())) {
            showErrorMessage("Enter a valid email address")
            isValid = false
        }

        if (password.isEmpty()) {
            showErrorMessage("Password is required")
            isValid = false
        } else if (password.length < 8) {
            showErrorMessage("Password must be at least 8 characters")
            isValid = false
        } else if (!password.any { it.isUpperCase() }) {
            showErrorMessage("Include at least one uppercase letter")
            isValid = false
        } else if (!password.any { it.isDigit() }) {
            showErrorMessage("Include at least one number")
            isValid = false
        }

        if (confirmPassword.isEmpty()) {
            showErrorMessage("Please confirm your password")
            isValid = false
        } else if (password != confirmPassword) {
            showErrorMessage("Passwords do not match")
            isValid = false
        }

        return isValid
    }

    private fun showErrorMessage(message: String) {
        binding.errorMessage.text = message
        binding.errorMessage.visibility = View.VISIBLE
    }

    private fun showSuccessMessage(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
    }
}
