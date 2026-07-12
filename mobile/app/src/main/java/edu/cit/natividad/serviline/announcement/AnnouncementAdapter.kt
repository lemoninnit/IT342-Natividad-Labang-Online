package edu.cit.natividad.serviline.announcement

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.natividad.serviline.R
import edu.cit.natividad.serviline.api.models.Announcement

class AnnouncementAdapter(private var announcements: List<Announcement>) :
    RecyclerView.Adapter<AnnouncementAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvType: TextView = view.findViewById(R.id.tvType)
        val tvTitle: TextView = view.findViewById(R.id.tvTitle)
        val tvDate: TextView = view.findViewById(R.id.tvDate)
        val tvTime: TextView = view.findViewById(R.id.tvTime)
        val tvAuthor: TextView = view.findViewById(R.id.tvAuthor)
        val tvContent: TextView = view.findViewById(R.id.tvContent)
        val cardPriority: View = view.findViewById(R.id.cardPriority)
        val tvPriority: TextView = view.findViewById(R.id.tvPriority)
        val btnDetails: View = view.findViewById(R.id.btnDetails)
        // val tvExpires: TextView = view.findViewById(R.id.tvExpires) // Assuming we don't have expiration yet in backend
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_announcement, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val ann = announcements[position]
        holder.tvType.text = ann.type?.uppercase() ?: "GENERAL"
        holder.tvTitle.text = ann.title
        holder.tvAuthor.text = ann.postedBy ?: "Admin"
        holder.tvContent.text = ann.content

        // Simple formatting for createdAt if it's ISO 8601
        try {
            val dateTime = ann.createdAt.split("T")
            if (dateTime.size == 2) {
                holder.tvDate.text = dateTime[0]
                holder.tvTime.text = dateTime[1].substring(0, 5) // roughly extract HH:mm
            } else {
                holder.tvDate.text = ann.createdAt
                holder.tvTime.text = ""
            }
        } catch (e: Exception) {
            holder.tvDate.text = ann.createdAt
            holder.tvTime.text = ""
        }

        if (ann.priority?.uppercase() == "URGENT" || ann.priority?.uppercase() == "HIGH") {
            holder.cardPriority.visibility = View.VISIBLE
            holder.tvPriority.text = ann.priority.uppercase()
        } else {
            holder.cardPriority.visibility = View.GONE
        }

        holder.btnDetails.setOnClickListener {
            val context = holder.itemView.context
            val dialogView = LayoutInflater.from(context).inflate(R.layout.dialog_announcement_details, null)
            
            val dialogTvType: TextView = dialogView.findViewById(R.id.dialogTvType)
            val dialogTvPriority: TextView = dialogView.findViewById(R.id.dialogTvPriority)
            val dialogCardPriority: View = dialogView.findViewById(R.id.dialogCardPriority)
            val dialogTvTitle: TextView = dialogView.findViewById(R.id.dialogTvTitle)
            val dialogTvAuthor: TextView = dialogView.findViewById(R.id.dialogTvAuthor)
            val dialogTvDate: TextView = dialogView.findViewById(R.id.dialogTvDate)
            val dialogTvTime: TextView = dialogView.findViewById(R.id.dialogTvTime)
            val dialogTvContent: TextView = dialogView.findViewById(R.id.dialogTvContent)
            val dialogBtnClose: View = dialogView.findViewById(R.id.dialogBtnClose)
            
            dialogTvType.text = ann.type?.uppercase() ?: "GENERAL"
            dialogTvTitle.text = ann.title
            dialogTvAuthor.text = "Posted by: ${ann.postedBy ?: "Admin"}"
            dialogTvContent.text = ann.content
            
            try {
                val dateTime = ann.createdAt.split("T")
                if (dateTime.size == 2) {
                    dialogTvDate.text = "Date: ${dateTime[0]}"
                    dialogTvTime.text = dateTime[1].substring(0, 5)
                } else {
                    dialogTvDate.text = "Date: ${ann.createdAt}"
                    dialogTvTime.text = ""
                }
            } catch (e: Exception) {
                dialogTvDate.text = "Date: ${ann.createdAt}"
                dialogTvTime.text = ""
            }
            
            if (ann.priority?.uppercase() == "URGENT" || ann.priority?.uppercase() == "HIGH") {
                dialogCardPriority.visibility = View.VISIBLE
                dialogTvPriority.text = ann.priority.uppercase()
            } else {
                dialogCardPriority.visibility = View.GONE
            }
            
            val dialog = com.google.android.material.dialog.MaterialAlertDialogBuilder(context)
                .setView(dialogView)
                .create()
                
            dialog.window?.setBackgroundDrawable(android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT))
            
            dialogBtnClose.setOnClickListener {
                dialog.dismiss()
            }
            
            dialog.show()
        }
    }

    override fun getItemCount() = announcements.size

    fun updateData(newAnnouncements: List<Announcement>) {
        announcements = newAnnouncements
        notifyDataSetChanged()
    }
}
