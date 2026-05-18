package edu.cit.natividad.labangonline.auth

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.textfield.TextInputLayout
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.RegisterRequest
import edu.cit.natividad.labangonline.databinding.ActivityRegisterBinding
import kotlinx.coroutines.launch
import java.util.Calendar

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private val calendar = Calendar.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupSpinners()
        setupDatePicker()
        setupRealTimeValidation()

        binding.btnLogoBack.setOnClickListener {
            val intent = Intent(this@RegisterActivity, edu.cit.natividad.labangonline.LabangOnlineApplication::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            startActivity(intent)
            overridePendingTransition(0, 0)
            finish()
        }
        binding.registerButton.setOnClickListener { handleRegistration() }

        // Standardize bottom link with SpannableString to prevent ugly text wraps/clipping
        val loginRedirectText = "Already have an account? Login here"
        val spannable = android.text.SpannableString(loginRedirectText)
        val greenColor = ContextCompat.getColor(this, R.color.labang_green)
        val clickSpan = object : android.text.style.ClickableSpan() {
            override fun onClick(widget: View) {
                finish()
            }
            override fun updateDrawState(ds: android.text.TextPaint) {
                super.updateDrawState(ds)
                ds.color = greenColor
                ds.isUnderlineText = false
                ds.isFakeBoldText = true
            }
        }
        val startIdx = loginRedirectText.indexOf("Login here")
        if (startIdx != -1) {
            spannable.setSpan(clickSpan, startIdx, loginRedirectText.length, android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
        binding.backButton.text = spannable
        binding.backButton.movementMethod = android.text.method.LinkMovementMethod.getInstance()
        binding.backButton.highlightColor = android.graphics.Color.TRANSPARENT
    }

    private fun setupSpinners() {
        val civilStatusOptions = listOf("Single", "Married", "Widowed", "Separated")
        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, civilStatusOptions)
        binding.civilStatusInput.setAdapter(adapter)
        binding.civilStatusInput.setText(civilStatusOptions[0], false)
    }

    private fun setupDatePicker() {
        binding.dobInput.setOnClickListener {
            DatePickerDialog(
                this,
                R.style.Theme_LabangOnline_DatePicker,
                { _, year, month, day ->
                    calendar.set(year, month, day)
                    val formatted = "%02d/%02d/%04d".format(month + 1, day, year)
                    binding.dobInput.setText(formatted)
                    validateField("dateOfBirth")
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }
    }

    private fun setupRealTimeValidation() {
        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                // We will validate on focus lost or on button click mostly to match web "touched" behavior
            }
        }

        val fields = listOf(
            binding.firstNameInput to "firstName",
            binding.lastNameInput to "lastName",
            binding.usernameInput to "username",
            binding.emailInput to "email",
            binding.phoneInput to "phone",
            binding.addressInput to "addressLine",
            binding.purokInput to "purok",
            binding.passwordInput to "password",
            binding.confirmPasswordInput to "confirmPassword"
        )

        fields.forEach { (view, name) ->
            view.setOnFocusChangeListener { _, hasFocus ->
                if (!hasFocus) validateField(name)
            }
            view.addTextChangedListener(watcher)
        }
    }

    private fun validateField(name: String): String? {
        val value = when (name) {
            "firstName" -> binding.firstNameInput.text.toString()
            "lastName" -> binding.lastNameInput.text.toString()
            "username" -> binding.usernameInput.text.toString()
            "email" -> binding.emailInput.text.toString()
            "phone" -> binding.phoneInput.text.toString()
            "dateOfBirth" -> binding.dobInput.text.toString()
            "addressLine" -> binding.addressInput.text.toString()
            "purok" -> binding.purokInput.text.toString()
            "password" -> binding.passwordInput.text.toString()
            "confirmPassword" -> binding.confirmPasswordInput.text.toString()
            else -> ""
        }

        val error = when (name) {
            "firstName" -> if (value.isBlank()) "First name is required" else null
            "lastName" -> if (value.isBlank()) "Last name is required" else null
            "username" -> {
                if (value.isBlank()) "Username is required"
                else if (value.length < 3) "Username must be at least 3 characters"
                else null
            }
            "email" -> {
                if (value.isBlank()) "Email is required"
                else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(value).matches()) "Invalid email address"
                else null
            }
            "phone" -> {
                val cleanPhone = value.replace("\\s".toRegex(), "")
                if (value.isBlank() || value == "+63") "Phone number is required"
                else if (!cleanPhone.matches("^(\\+63)[0-9]{10}$".toRegex())) "Invalid Philippine mobile number (13 digits including +63)"
                else null
            }
            "dateOfBirth" -> if (value.isBlank()) "Date of birth is required" else null
            "addressLine" -> if (value.isBlank()) "Address line is required" else null
            "purok" -> if (value.isBlank()) "Purok is required" else null
            "password" -> {
                if (value.isBlank()) "Password is required"
                else if (value.length < 8) "Must be at least 8 characters"
                else null
            }
            "confirmPassword" -> {
                if (value.isBlank()) "Please confirm your password"
                else if (value != binding.passwordInput.text.toString()) "Passwords do not match"
                else null
            }
            else -> null
        }

        val layout = when (name) {
            "firstName" -> binding.firstNameLayout
            "lastName" -> binding.lastNameLayout
            "username" -> binding.usernameLayout
            "email" -> binding.emailLayout
            "phone" -> binding.phoneLayout
            "dateOfBirth" -> binding.dobLayout
            "addressLine" -> binding.addressLayout
            "purok" -> binding.purokLayout
            "password" -> binding.passwordLayout
            "confirmPassword" -> binding.confirmPasswordLayout
            else -> null
        }

        layout?.error = error
        layout?.isErrorEnabled = error != null
        return error
    }

    private fun handleRegistration() {
        val fieldNames = listOf(
            "firstName", "lastName", "username", "email", "phone",
            "dateOfBirth", "addressLine", "purok", "password", "confirmPassword"
        )

        var hasErrors = false
        fieldNames.forEach { name ->
            if (validateField(name) != null) hasErrors = true
        }

        if (hasErrors) return

        lifecycleScope.launch {
            try {
                setLoading(true)
                hideErrorBanner()

                // Format DOB to yyyy-MM-dd for backend
                val dobParts = binding.dobInput.text.toString().split("/")
                val formattedDob = "${dobParts[2]}-${dobParts[0]}-${dobParts[1]}"

                val request = RegisterRequest(
                    firstName = binding.firstNameInput.text.toString().trim(),
                    middleName = binding.middleNameInput.text.toString().trim().ifBlank { null },
                    lastName = binding.lastNameInput.text.toString().trim(),
                    username = binding.usernameInput.text.toString().trim(),
                    email = binding.emailInput.text.toString().trim().lowercase(),
                    phone = binding.phoneInput.text.toString().trim(),
                    dob = formattedDob,
                    civilStatus = binding.civilStatusInput.text.toString(),
                    street = binding.addressInput.text.toString().trim(),
                    purok = binding.purokInput.text.toString().trim(),
                    barangay = binding.barangayInput.text.toString(),
                    city = binding.cityInput.text.toString(),
                    province = binding.provinceInput.text.toString(),
                    postalCode = binding.postalCodeInput.text.toString(),
                    password = binding.passwordInput.text.toString()
                )

                val response = ApiClient.getAuthService().register(request)

                if (response.isSuccessful) {
                    // Navigate to Success Activity (or show success and move to login)
                    val intent = Intent(this@RegisterActivity, LoginActivity::class.java)
                    intent.putExtra("REGISTRATION_SUCCESS", true)
                    startActivity(intent)
                    finish()
                } else {
                    val errorBody = response.errorBody()?.string()
                    when {
                        errorBody?.contains("EMAIL_EXISTS") == true -> showErrorBanner("Email is already registered.")
                        errorBody?.contains("PHONE_EXISTS") == true -> showErrorBanner("Phone number is already registered.")
                        errorBody?.contains("USERNAME_EXISTS") == true -> showErrorBanner("Username is already taken.")
                        else -> showErrorBanner("Registration failed. Please try again.")
                    }
                }
            } catch (e: Exception) {
                showErrorBanner("Something went wrong. Please check your connection.")
                e.printStackTrace()
            } finally {
                setLoading(false)
            }
        }
    }

    private fun setLoading(isLoading: Boolean) {
        binding.loadingIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.registerButton.isEnabled = !isLoading
        binding.backButton.isEnabled = !isLoading
    }

    private fun showErrorBanner(message: String) {
        binding.errorBannerText.text = message
        binding.errorBanner.visibility = View.VISIBLE
        // Scroll to top to see the error
        binding.root.findViewById<View>(R.id.errorBanner).parent.requestChildFocus(
            binding.errorBanner, binding.errorBanner
        )
    }

    private fun hideErrorBanner() {
        binding.errorBanner.visibility = View.GONE
    }
}
