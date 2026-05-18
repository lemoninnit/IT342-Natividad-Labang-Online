package edu.cit.natividad.labangonline.requests

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.PaymentVerificationDTO
import edu.cit.natividad.labangonline.databinding.ActivityOtcPaymentBinding
import kotlinx.coroutines.launch

class OTCPaymentActivity : AppCompatActivity() {

    private lateinit var binding: ActivityOtcPaymentBinding
    private var paymentId: Long = -1
    private var amount: Double = 0.0
    private var refNum: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOtcPaymentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        paymentId = intent.getLongExtra("PAYMENT_ID", -1)
        amount = intent.getDoubleExtra("AMOUNT", 0.0)
        refNum = intent.getStringExtra("REF_NUM") ?: "REF-UNKNOWN"

        binding.tvAmount.text = "₱%.2f".format(amount)
        binding.tvRefNum.text = refNum

        setupListeners()
    }

    private fun setupListeners() {
        binding.btnCancel.setOnClickListener { finish() }

        binding.btnConfirm.setOnClickListener {
            verifyPayment()
        }
    }

    private fun verifyPayment() {
        val transId = binding.etTransactionId.text.toString().trim()
        
        if (transId.isEmpty() || transId.length < 13) {
            Toast.makeText(this, "A valid 13-digit Transaction ID is required to verify", Toast.LENGTH_SHORT).show()
            return
        }

        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        val dto = PaymentVerificationDTO(
            paymentId = paymentId,
            referenceNumber = transId, // using transaction ID as reference for OTC verification
            status = "PENDING"
        )

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.btnConfirm.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = ApiClient.getPaymentService().verifyPayment(userId, dto)
                if (response.isSuccessful) {
                    Toast.makeText(this@OTCPaymentActivity, "Payment verified successfully", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this@OTCPaymentActivity, "Failed to verify payment", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@OTCPaymentActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.btnConfirm.isEnabled = true
            }
        }
    }
}
