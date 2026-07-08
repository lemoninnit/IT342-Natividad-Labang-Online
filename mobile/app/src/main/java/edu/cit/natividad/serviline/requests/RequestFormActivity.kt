package edu.cit.natividad.serviline.requests

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.serviline.api.ApiClient
import edu.cit.natividad.serviline.api.models.CertificateRequestDTO
import edu.cit.natividad.serviline.databinding.ActivityRequestFormBinding
import kotlinx.coroutines.launch

class RequestFormActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRequestFormBinding
    private var certificateType: String = ""
    private var certificateTitle: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRequestFormBinding.inflate(layoutInflater)
        setContentView(binding.root)

        certificateType = intent.getStringExtra("CERT_TYPE") ?: ""
        certificateTitle = intent.getStringExtra("CERT_TITLE") ?: "Request Certificate"

        binding.tvCertificateTitle.text = certificateTitle

        setupListeners()
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }
        binding.btnCancel.setOnClickListener { finish() }

        binding.btnSubmit.setOnClickListener {
            submitRequest()
        }
    }

    private fun submitRequest() {
        val purpose = binding.etPurpose.text.toString().trim()
        
        if (purpose.isEmpty()) {
            Toast.makeText(this, "Purpose is required", Toast.LENGTH_SHORT).show()
            return
        }

        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        if (userId == -1L) {
            Toast.makeText(this, "User session error", Toast.LENGTH_SHORT).show()
            return
        }

        val requestDto = CertificateRequestDTO(
            certificateType = certificateType,
            purpose = purpose,
            attachmentPath = null
        )

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.btnSubmit.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = ApiClient.getCertificateService().submitRequest(userId, requestDto)
                if (response.isSuccessful) {
                    Toast.makeText(this@RequestFormActivity, "Request submitted successfully", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this@RequestFormActivity, "Failed to submit request", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@RequestFormActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.btnSubmit.isEnabled = true
            }
        }
    }
}
