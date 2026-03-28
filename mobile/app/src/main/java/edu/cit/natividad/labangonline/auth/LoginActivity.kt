package edu.cit.natividad.labangonline.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import edu.cit.natividad.labangonline.dashboard.DashboardActivity
import edu.cit.natividad.labangonline.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

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

        binding.errorMessage.visibility = View.GONE

        if (!validateInputs(email, password)) {
            return
        }

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.loginButton.isEnabled = false

        binding.loadingIndicator.postDelayed({
            binding.loadingIndicator.visibility = View.GONE
            binding.loginButton.isEnabled = true
            Snackbar.make(binding.root, "Login successful", Snackbar.LENGTH_SHORT).show()
            startActivity(Intent(this@LoginActivity, DashboardActivity::class.java))
            finish()
        }, 1000)
    }

    private fun validateInputs(email: String, password: String): Boolean {
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
