package edu.cit.natividad.serviline.requests

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.serviline.api.ApiClient
import edu.cit.natividad.serviline.api.models.PaymentDTO
import edu.cit.natividad.serviline.databinding.ActivitySelectPaymentModeBinding
import kotlinx.coroutines.launch

class SelectPaymentModeActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySelectPaymentModeBinding
    private var selectedMode: String? = null
    private var requestId: Long = -1
    private var certType: String = ""
    private var amount: Double = 0.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySelectPaymentModeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        requestId = intent.getLongExtra("REQUEST_ID", -1)
        certType = intent.getStringExtra("CERT_TYPE") ?: ""
        
        // Calculate amount based on type
        amount = when (certType) {
            "BARANGAY_CLEARANCE" -> 50.0
            "RESIDENCY_CERTIFICATE" -> 30.0
            "INDIGENCY_CERTIFICATE" -> 20.0
            "GOOD_MORAL_CHARACTER" -> 40.0
            "BUSINESS_PERMIT" -> 100.0
            else -> 0.0
        }

        setupListeners()
    }

    private fun setupListeners() {
        binding.btnCancel.setOnClickListener { finish() }

        binding.cardGcash.setOnClickListener {
            selectedMode = "GCASH"
            binding.rbGcash.isChecked = true
            binding.rbOtc.isChecked = false
            binding.btnProceed.isEnabled = true
            binding.btnProceed.setBackgroundColor(android.graphics.Color.parseColor("#00b894"))
        }

        binding.cardOtc.setOnClickListener {
            selectedMode = "OVER_THE_COUNTER"
            binding.rbGcash.isChecked = false
            binding.rbOtc.isChecked = true
            binding.btnProceed.isEnabled = true
            binding.btnProceed.setBackgroundColor(android.graphics.Color.parseColor("#00b894"))
        }

        binding.btnProceed.setOnClickListener {
            initiatePayment()
        }
    }

    private fun initiatePayment() {
        if (selectedMode == null) return

        if (selectedMode == "GCASH") {
            val intent = Intent(this@SelectPaymentModeActivity, GCashPaymentActivity::class.java).apply {
                putExtra("REQUEST_ID", requestId)
                putExtra("AMOUNT", amount)
            }
            startActivity(intent)
        } else {
            val intent = Intent(this@SelectPaymentModeActivity, OTCPaymentActivity::class.java).apply {
                putExtra("REQUEST_ID", requestId)
                putExtra("AMOUNT", amount)
            }
            startActivity(intent)
        }
        finish()
    }
}
