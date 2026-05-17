package edu.cit.natividad.labangonline.announcement

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.api.models.Announcement

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
    }

    override fun getItemCount() = announcements.size

    fun updateData(newAnnouncements: List<Announcement>) {
        announcements = newAnnouncements
        notifyDataSetChanged()
    }
}
