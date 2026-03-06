import os

def topic_assignment_template(student_name: str, topic_title: str, group_name: str, due_date: str = None):
    due_text = due_date or "Not set"
    subject = f"📢 New Topic Assigned: {topic_title}"
    text = f"""Hello {student_name},

A new topic "{topic_title}" has been assigned to your group ({group_name}).
Due date: {due_text}

Please log in to upload your outline.
"""
    html = f"""
    <h2>New Topic Assigned</h2>
    <p>Hello {student_name},</p>
    <p>A new topic <strong>"{topic_title}"</strong> has been assigned to your group ({group_name}).</p>
    <p><strong>Due date:</strong> {due_text}</p>
    <p>Please <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login">log in</a> to upload your outline.</p>
    """
    return subject, text, html