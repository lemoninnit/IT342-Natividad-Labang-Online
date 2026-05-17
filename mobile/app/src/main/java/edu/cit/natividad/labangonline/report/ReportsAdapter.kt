package edu.cit.natividad.labangonline.report

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.natividad.labangonline.api.models.ComplaintResponseDTO
import edu.cit.natividad.labangonline.databinding.ItemReportBinding

class ReportsAdapter(
    private var reports: List<ComplaintResponseDTO>
) : RecyclerView.Adapter<ReportsAdapter.ReportViewHolder>() {

    private val expandedItems = mutableSetOf<Int>()

    inner class ReportViewHolder(val binding: ItemReportBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(report: ComplaintResponseDTO, position: Int) {
            binding.tvIncidentType.text = report.incidentType
            val created = formatDateTime(report.createdAt)
            binding.tvDate.text = created
            
            binding.tvReportId.text = report.id.toString()
            binding.tvStatusDetail.text = report.status.uppercase()
            binding.tvSubmitted.text = created
            binding.tvUpdated.text = created // Complaint doesn't track updatedAt separately

            binding.tvIncidentDateTimeDetail.text = "${report.incidentDate} at ${report.incidentTime}"
            binding.tvLocationDetail.text = report.location
            binding.tvPersonsDetail.text = report.personsInvolved ?: "N/A"
            binding.tvDescription.text = report.description

            val statusColor = when (report.status.uppercase()) {
                "PENDING" -> Color.parseColor("#f59e0b")
                "REVIEWED", "RESOLVED" -> Color.parseColor("#10b981")
                else -> Color.parseColor("#bbcbbb")
            }
            binding.tvStatus.setTextColor(statusColor)
            binding.tvStatusDetail.setTextColor(statusColor)

            val isExpanded = expandedItems.contains(position)
            binding.layoutDetails.visibility = if (isExpanded) View.VISIBLE else View.GONE
            binding.ivExpand.rotation = if (isExpanded) 180f else 0f

            binding.layoutHeader.setOnClickListener {
                if (isExpanded) {
                    expandedItems.remove(position)
                } else {
                    expandedItems.add(position)
                }
                notifyItemChanged(position)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReportViewHolder {
        val binding = ItemReportBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ReportViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ReportViewHolder, position: Int) {
        holder.bind(reports[position], position)
    }

    override fun getItemCount() = reports.size

    fun updateData(newReports: List<ComplaintResponseDTO>) {
        reports = newReports
        notifyDataSetChanged()
    }

    private fun formatDateTime(dateTimeStr: String?): String? {
        if (dateTimeStr.isNullOrEmpty()) return null
        return try {
            val dateTime = dateTimeStr.split("T")
            if (dateTime.size == 2) {
                "${dateTime[0]}, ${dateTime[1].substring(0, 5)}"
            } else {
                dateTimeStr
            }
        } catch (e: Exception) {
            dateTimeStr
        }
    }
}
