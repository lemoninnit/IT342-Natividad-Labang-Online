package edu.cit.natividad.labangonline.requests

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.databinding.ActivityRecordsBinding
import kotlinx.coroutines.launch

class RecordsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRecordsBinding
    private lateinit var adapter: RecordsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRecordsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        setupListeners()
        fetchRecords()
    }

    private fun setupRecyclerView() {
        adapter = RecordsAdapter(emptyList()) { record ->
            // Proceed to Payment clicked
            val intent = Intent(this, SelectPaymentModeActivity::class.java).apply {
                putExtra("REQUEST_ID", record.id)
                putExtra("CERT_TYPE", record.certificateType)
            }
            startActivity(intent)
        }
        binding.rvRecords.layoutManager = LinearLayoutManager(this)
        binding.rvRecords.adapter = adapter
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }
        binding.btnRefresh.setOnClickListener { fetchRecords() }
    }

    private fun fetchRecords() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        if (userId == -1L) {
            Toast.makeText(this, "User session error", Toast.LENGTH_SHORT).show()
            return
        }

        binding.loadingIndicator.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = ApiClient.getCertificateService().getMyRequests(userId)
                if (response.isSuccessful) {
                    val records = response.body() ?: emptyList()
                    adapter.updateData(records)
                    updateSummaries(records)
                } else {
                    Toast.makeText(this@RecordsActivity, "Failed to load records", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@RecordsActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
            }
        }
    }

    private fun updateSummaries(records: List<edu.cit.natividad.labangonline.api.models.CertificateRequestResponseDTO>) {
        val total = records.size
        val pending = records.count { it.status.uppercase() == "PENDING" || it.status.uppercase() == "PAYMENT_PENDING" }
        val completed = records.count { it.status.uppercase() == "COMPLETED" || it.status.uppercase() == "APPROVED" }
        val rejected = records.count { it.status.uppercase() == "REJECTED" }

        binding.tvTotalRequests.text = total.toString()
        binding.tvPendingRequests.text = pending.toString()
        binding.tvCompletedRequests.text = completed.toString()
        binding.tvRejectedRequests.text = rejected.toString()
    }

    override fun onResume() {
        super.onResume()
        fetchRecords() // Refresh when coming back from payment
    }
}
