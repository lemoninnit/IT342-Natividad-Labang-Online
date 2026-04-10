package edu.cit.natividad.labangonline.auth

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.databinding.ActivityRegisterBinding
import java.util.Calendar

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupGenderSpinner()
        setupDatePicker()

        binding.registerButton.setOnClickListener { handleRegistration() }
        binding.backButton.setOnClickListener { finish() }
    }

    private fun setupGenderSpinner() {
        val genderOptions = listOf("Select gender", "Male", "Female", "Prefer not to say")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, genderOptions)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.genderSpinner.adapter = adapter
    }

    private fun setupDatePicker() {
        binding.dobInput.setOnClickListener {
            val cal = Calendar.getInstance()
            DatePickerDialog(
                this,
                { _, year, month, day ->
                    val formatted = "%02d/%02d/%04d".format(month + 1, day, year)
                    binding.dobInput.setText(formatted)
                },
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH),
                cal.get(Calendar.DAY_OF_MONTH)
            ).show()
        }
    }

    private fun handleRegistration() {
        val firstName  = binding.firstNameInput.text.toString().trim()
        val lastName   = binding.lastNameInput.text.toString().trim()
        val email      = binding.emailInput.text.toString().trim()
        val phone      = binding.phoneInput.text.toString().trim()
        val password   = binding.passwordInput.text.toString()
        val confirm    = binding.confirmPasswordInput.text.toString()
        val agreedToTerms = binding.agreeTermsCheckbox.isChecked

        binding.errorMessage.visibility = View.GONE

        if (!validateInputs(firstName, lastName, email, phone, password, confirm, agreedToTerms)) return

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.registerButton.isEnabled = false

        binding.loadingIndicator.postDelayed({
            binding.loadingIndicator.visibility = View.GONE
            binding.registerButton.isEnabled = true
            Snackbar.make(binding.root, "Registration successful!", Snackbar.LENGTH_SHORT).show()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }, 1200)
    }

    private fun validateInputs(
        firstName: String, lastName: String,
        email: String, phone: String,
        password: String, confirm: String,
        agreedToTerms: Boolean
    ): Boolean {
        if (firstName.isEmpty()) { showError("First name is required"); return false }
        if (lastName.isEmpty())  { showError("Last name is required");  return false }
        if (email.isEmpty())     { showError("Email is required");       return false }
        if (!isValidEmail(email)) { showError("Enter a valid email address"); return false }
        if (phone.isEmpty())     { showError("Mobile number is required"); return false }
        if (!isValidPhone(phone)) { showError("Enter a valid PH number (09XXXXXXXXX)"); return false }
        if (password.isEmpty())  { showError("Password is required");   return false }
        if (password.length < 8) { showError("Password must be at least 8 characters"); return false }
        if (!password.any { it.isUpperCase() }) { showError("Password needs at least one uppercase letter"); return false }
        if (!password.any { it.isDigit() })     { showError("Password needs at least one number"); return false }
        if (password != confirm) { showError("Passwords do not match"); return false }
        if (!agreedToTerms)      { showError("You must agree to the Terms and Conditions"); return false }
        return true
    }

    private fun isValidEmail(email: String) =
        email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$".toRegex())

    private fun isValidPhone(phone: String) =
        phone.replace("\\s".toRegex(), "").matches("^(09|\\+639)\\d{9}$".toRegex())

    private fun showError(message: String) {
        binding.errorMessage.text = message
        binding.errorMessage.visibility = View.VISIBLE
    }
}