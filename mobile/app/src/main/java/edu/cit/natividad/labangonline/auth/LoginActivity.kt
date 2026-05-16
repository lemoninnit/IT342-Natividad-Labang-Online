package edu.cit.natividad.labangonline.auth

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.LoginRequest
import edu.cit.natividad.labangonline.dashboard.DashboardActivity
import edu.cit.natividad.labangonline.databinding.ActivityLoginBinding
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Show registration success message if redirected from Register
        if (intent.getBooleanExtra("REGISTRATION_SUCCESS", false)) {
            Snackbar.make(binding.root, "Registration successful! You can now log in.", Snackbar.LENGTH_LONG)
                .setBackgroundTint(ContextCompat.getColor(this, R.color.labang_green))
                .setTextColor(ContextCompat.getColor(this, android.R.color.white))
                .show()
        }

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.loginButton.setOnClickListener {
            handleLogin()
        }

        binding.registerButton.setOnClickListener {
            startActivity(Intent(this@LoginActivity, RegisterActivity::class.java))
        }
    }

    private fun handleLogin() {
        val username = binding.usernameInput.text.toString().trim()
        val password = binding.passwordInput.text.toString()

        hideError()

        if (!validateInputs(username, password)) {
            return
        }

        setLoading(true)

        lifecycleScope.launch {
            try {
                val response = ApiClient.getAuthService().login(LoginRequest(username, password))

                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()!!
                    val user = loginResponse.user

                    if (!user.active) {
                        showError("Your account is not active. Please contact Barangay Labangon.")
                        setLoading(false)
                        return@launch
                    }

                    // Store JWT Token and User Data securely
                    val fullName = "${user.firstName} ${user.lastName}".trim()
                    saveSession(loginResponse.token, user.username, user.role, fullName)

                    Snackbar.make(binding.root, "Login successful", Snackbar.LENGTH_SHORT).show()
                    
                    val nextIntent = Intent(this@LoginActivity, DashboardActivity::class.java).apply {
                        putExtra("USER_NAME", fullName)
                    }
                    
                    startActivity(nextIntent)
                    finish()
                } else {
                    if (response.code() == 401) {
                        showError("Incorrect username/password or account is not yet confirmed by the Barangay.")
                    } else {
                        showError("Login failed. Please try again.")
                    }
                }
            } catch (e: Exception) {
                showError("Something went wrong. Please check your connection.")
                e.printStackTrace()
            } finally {
                setLoading(false)
            }
        }
    }

    private fun validateInputs(username: String, password: String): Boolean {
        var isValid = true

        if (username.isEmpty()) {
            binding.usernameLayout.error = "Username is required."
            isValid = false
        } else {
            binding.usernameLayout.error = null
        }

        if (password.isEmpty()) {
            binding.passwordLayout.error = "Password is required."
            isValid = false
        } else {
            binding.passwordLayout.error = null
        }

        return isValid
    }

    private fun saveSession(token: String, username: String, role: String, fullName: String) {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("jwt_token", token)
            putString("username", username)
            putString("role", role)
            putString("full_name", fullName)
            apply()
        }
    }

    private fun setLoading(isLoading: Boolean) {
        binding.loadingIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.loginButton.isEnabled = !isLoading
        binding.registerButton.isEnabled = !isLoading
    }

    private fun showError(message: String) {
        binding.errorMessage.text = message
        binding.errorBanner.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.errorBanner.visibility = View.GONE
    }
}
