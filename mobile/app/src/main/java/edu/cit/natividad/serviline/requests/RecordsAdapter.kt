package edu.cit.natividad.serviline.requests

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.natividad.serviline.api.models.CertificateRequestResponseDTO
import edu.cit.natividad.serviline.databinding.ItemRecordBinding

class RecordsAdapter(
    private var records: List<CertificateRequestResponseDTO>,
    private val onProceedToPayment: (CertificateRequestResponseDTO) -> Unit
) : RecyclerView.Adapter<RecordsAdapter.RecordViewHolder>() {

    private val expandedItems = mutableSetOf<Int>()

    inner class RecordViewHolder(val binding: ItemRecordBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(record: CertificateRequestResponseDTO, position: Int) {
            binding.tvCertificateType.text = formatType(record.certificateType)
            binding.tvStatus.text = record.status.uppercase()
            binding.tvStatusDetail.text = record.status.uppercase()
            val created = formatDateTime(record.requestDate)
            val updated = formatDateTime(record.updatedAt) ?: created

            binding.tvDate.text = created
            
            binding.tvRequestId.text = record.id.toString()
            binding.tvSubmitted.text = created
            binding.tvUpdated.text = updated
            binding.tvPurpose.text = record.purpose

            // Color code the status
            val statusColor = when (record.status.uppercase()) {
                "PENDING" -> Color.parseColor("#f59e0b") // Yellow/Orange
                "PROCESSING" -> Color.parseColor("#3b82f6") // Blue
                "APPROVED", "COMPLETED", "VERIFIED" -> Color.parseColor("#10b981") // Green
                "REJECTED", "FAILED" -> Color.parseColor("#ef4444") // Red
                else -> Color.parseColor("#bbcbbb") // Gray
            }
            binding.tvStatus.setTextColor(statusColor)
            binding.tvStatusDetail.setTextColor(statusColor)

            if (record.payment != null) {
                binding.layoutPaymentInfo.visibility = View.VISIBLE
                binding.tvPaymentMethod.text = record.payment.paymentMethod
                binding.tvPaymentAmount.text = "₱${record.payment.amount}"
                binding.tvPaymentRef.text = record.payment.referenceNumber ?: "N/A"
                binding.tvPaymentStatusDetail.text = record.payment.status.uppercase()
                
                val paymentStatusColor = when (record.payment.status.uppercase()) {
                    "PENDING", "PROCESSING" -> Color.parseColor("#3b82f6") // Blue
                    "PAID", "VERIFIED" -> Color.parseColor("#10b981") // Green
                    "FAILED" -> Color.parseColor("#ef4444") // Red
                    else -> Color.parseColor("#bbcbbb") // Gray
                }
                binding.tvPaymentStatusDetail.setTextColor(paymentStatusColor)
            } else {
                binding.layoutPaymentInfo.visibility = View.GONE
            }

            // Hide/Show Proceed to Payment button based on status
            if (record.status.uppercase() == "PENDING" || record.status.uppercase() == "PAYMENT_PENDING") {
                binding.btnProceedPayment.visibility = View.VISIBLE
            } else {
                binding.btnProceedPayment.visibility = View.GONE
            }

            val isExpanded = expandedItems.contains(position)
            binding.layoutDetails.visibility = if (isExpanded) View.VISIBLE else View.GONE
            // Optional: rotate expand icon based on state
            binding.ivExpand.rotation = if (isExpanded) 180f else 0f

            binding.layoutHeader.setOnClickListener {
                if (isExpanded) {
                    expandedItems.remove(position)
                } else {
                    expandedItems.add(position)
                }
                notifyItemChanged(position)
            }

            binding.btnProceedPayment.setOnClickListener {
                onProceedToPayment(record)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecordViewHolder {
        val binding = ItemRecordBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return RecordViewHolder(binding)
    }

    override fun onBindViewHolder(holder: RecordViewHolder, position: Int) {
        holder.bind(records[position], position)
    }

    override fun getItemCount() = records.size

    fun updateData(newRecords: List<CertificateRequestResponseDTO>) {
        records = newRecords
        notifyDataSetChanged()
    }

    private fun formatType(type: String): String {
        return type.split("_").joinToString(" ") { it.replaceFirstChar { char -> char.uppercase() } }
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
