package edu.cit.natividad.labangonline.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.button.MaterialButton
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.LoginRequest
import edu.cit.natividad.labangonline.dashboard.DashboardActivity
import edu.cit.natividad.labangonline.databinding.ActivityLoginBinding
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val apiService = ApiClient.getAuthService()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        with(binding) {
            loginButton.setOnClickListener {
                handleLogin()
            }

            registerButton.setOnClickListener {
                startActivity(Intent(this@LoginActivity, RegisterActivity::class.java))
            }
        }
    }

    private fun handleLogin() {
        val email = binding.emailInput.text.toString().trim()
        val password = binding.passwordInput.text.toString()

        // Validation
        if (!validateInputs(email, password)) {
            return
        }

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.loginButton.isEnabled = false
        binding.errorMessage.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = apiService.login(LoginRequest(email, password))

                if (response.status == "OK") {
                    // Save user data locally (you can use DataStore or SharedPreferences)
                    showSuccessMessage("Login successful!")
                    // Navigate to Dashboard
                    startActivity(Intent(this@LoginActivity, DashboardActivity::class.java))
                    finish()
                } else {
                    showErrorMessage("Login failed: Invalid credentials")
                }
            } catch (e: Exception) {
                showErrorMessage("Error: ${e.message}")
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.loginButton.isEnabled = true
            }
        }
    }

    private fun validateInputs(email: String, password: String): Boolean {
        var isValid = true

        if (email.isEmpty()) {
            showErrorMessage("Email is required")
            isValid = false
        } else if (!isValidEmail(email)) {
            showErrorMessage("Please enter a valid email address")
            isValid = false
        }

        if (password.isEmpty()) {
            showErrorMessage("Password is required")
            isValid = false
        } else if (password.length < 8) {
            showErrorMessage("Password must be at least 8 characters")
            isValid = false
        }

        return isValid
    }

    private fun isValidEmail(email: String): Boolean {
        val emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$"
        return email.matches(emailRegex.toRegex())
    }

    private fun showErrorMessage(message: String) {
        binding.errorMessage.text = message
        binding.errorMessage.visibility = View.VISIBLE
    }

    private fun showSuccessMessage(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
    }
}
