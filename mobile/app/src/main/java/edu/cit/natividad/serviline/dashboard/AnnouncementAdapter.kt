package edu.cit.natividad.serviline.dashboard

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import edu.cit.natividad.serviline.R
import edu.cit.natividad.serviline.api.models.Announcement

class AnnouncementAdapter(
    context: Context,
    private val announcements: List<Announcement>
) : ArrayAdapter<Announcement>(context, 0, announcements) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context)
            .inflate(R.layout.item_announcement, parent, false)

        val announcement = getItem(position) ?: return view

        val titleView = view.findViewById<TextView>(R.id.tvTitle)
        val typeView = view.findViewById<TextView>(R.id.tvType)
        val contentView = view.findViewById<TextView>(R.id.tvContent)
        val dateView = view.findViewById<TextView>(R.id.tvDate)

        titleView.text = announcement.title
        typeView.text = announcement.type
        contentView.text = announcement.content
        dateView.text = "Posted on ${announcement.createdAt.substringBefore("T")}"

        return view
    }
}
