package edu.cit.natividad.labangonline.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import edu.cit.natividad.labangonline.databinding.ActivityRegisterBinding

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        with(binding) {
            registerButton.setOnClickListener {
                handleRegistration()
            }

            backButton.setOnClickListener {
                finish()
            }
        }
    }

    private fun handleRegistration() {
        val name = binding.nameInput.text.toString().trim()
        val email = binding.emailInput.text.toString().trim()
        val password = binding.passwordInput.text.toString()

        binding.errorMessage.visibility = View.GONE

        if (!validateInputs(name, email, password)) {
            return
        }

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.registerButton.isEnabled = false

        binding.loadingIndicator.postDelayed({
            binding.loadingIndicator.visibility = View.GONE
            binding.registerButton.isEnabled = true
            Snackbar.make(binding.root, "Registration successful", Snackbar.LENGTH_SHORT).show()
            startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
            finish()
        }, 1200)
    }

    private fun validateInputs(name: String, email: String, password: String): Boolean {
        if (name.isEmpty()) {
            showErrorMessage("Name is required")
            return false
        }

        if (email.isEmpty()) {
            showErrorMessage("Email is required")
            return false
        }

        if (!isValidEmail(email)) {
            showErrorMessage("Please enter a valid email address")
            return false
        }

        if (password.isEmpty()) {
            showErrorMessage("Password is required")
            return false
        }

        if (password.length < 8) {
            showErrorMessage("Password must be at least 8 characters")
            return false
        }

        return true
    }

    private fun isValidEmail(email: String): Boolean {
        val pattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        return email.matches(pattern.toRegex())
    }

    private fun showErrorMessage(message: String) {
        binding.errorMessage.text = message
        binding.errorMessage.visibility = View.VISIBLE
    }
}
