package edu.cit.natividad.serviline.report

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.natividad.serviline.api.ApiClient
import edu.cit.natividad.serviline.api.models.ComplaintResponseDTO
import edu.cit.natividad.serviline.databinding.ActivityReportRecordsBinding
import kotlinx.coroutines.launch

class ReportRecordsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityReportRecordsBinding
    private lateinit var adapter: ReportsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityReportRecordsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        setupListeners()
        fetchReports()
    }

    private fun setupRecyclerView() {
        adapter = ReportsAdapter(emptyList())
        binding.rvReports.layoutManager = LinearLayoutManager(this)
        binding.rvReports.adapter = adapter
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }
        binding.btnRefresh.setOnClickListener { fetchReports() }
    }

    private fun fetchReports() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        if (userId == -1L) {
            Toast.makeText(this, "User session error", Toast.LENGTH_SHORT).show()
            return
        }

        binding.loadingIndicator.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = ApiClient.getComplaintService().getMyComplaints(userId)
                if (response.isSuccessful) {
                    val reports = response.body() ?: emptyList()
                    adapter.updateData(reports)
                    updateSummaries(reports)
                } else {
                    Toast.makeText(this@ReportRecordsActivity, "Failed to load reports", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ReportRecordsActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
            }
        }
    }

    private fun updateSummaries(reports: List<ComplaintResponseDTO>) {
        val total = reports.size
        val pending = reports.count { it.status.uppercase() == "PENDING" }
        val reviewed = reports.count { it.status.uppercase() == "REVIEWED" || it.status.uppercase() == "RESOLVED" }
        val rejected = reports.count { it.status.uppercase() == "REJECTED" }

        binding.tvTotalReports.text = total.toString()
        binding.tvPendingReports.text = pending.toString()
        binding.tvReviewedReports.text = reviewed.toString()
        binding.tvRejectedReports.text = rejected.toString()
    }
}
