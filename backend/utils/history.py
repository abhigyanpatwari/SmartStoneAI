import sqlite3
import json

class History:
    def __init__(self, last_output: str, user_id, project_id):
        self.history = last_output
        self.user_id = str(user_id)
        self.project_id = str(project_id)
        self.id = f"{project_id}x{user_id}"

    def __call__(self):
        return self.history


class Histories:
    def __init__(self, db_loc='history.db'):
        self.db_loc = db_loc
        self.create_database()

    def create_database(self):
        conn = sqlite3.connect(self.db_loc)
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS history(
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                project_id TEXT NOT NULL,
                history TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

    def insert_history(self, history_obj: History):
        conn = sqlite3.connect(self.db_loc)
        c = conn.cursor()
        c.execute('''
            INSERT OR REPLACE INTO history (id, user_id, project_id, history)
            VALUES (?, ?, ?, ?)
        ''', (history_obj.id, history_obj.user_id, history_obj.project_id, history_obj.history))
        conn.commit()
        conn.close()

    def get_history(self, user_id: str, project_id: str):
        conn = sqlite3.connect(self.db_loc)
        c = conn.cursor()
        c.execute('''
            SELECT history FROM history
            WHERE user_id = ? AND project_id = ?
        ''', (user_id, project_id))
        result = c.fetchone()
        conn.close()
        if result:
            return result[0]
        else:
            return None

    def update_history(self, milestone):
        conn = sqlite3.connect(self.db_loc)
        c = conn.cursor()
        c.execute('''
            UPDATE history
            SET history = ?
            WHERE id = ? AND user_id = ? AND project_id = ?
        ''', (milestone.history, milestone.id, milestone.user_id, milestone.project_id))
        conn.commit()
        conn.close()

    def update_specific_milestone(self, project_history, milestone_data):
        milestones = self.parse_plain_text_to_milestones(project_history)

        # Update the specific milestone
        for milestone in milestones:
            if milestone['index'] == milestone_data['index']:  # Assuming `index` uniquely identifies a milestone
                milestone['title'] = milestone_data['title']
                milestone['description'] = milestone_data['description']
                milestone['roles'] = milestone_data['roles']
                milestone['deliverables'] = milestone_data['deliverables']
                milestone['time'] = milestone_data['time']
                break

        # Convert the list of milestones back to a plain text format for storage
        updated_history = self.convert_milestones_to_plain_text(milestones)
        return updated_history

    def parse_plain_text_to_milestones(self, history_string):
        milestones = []
        milestone_lines = history_string.split('\n')
        current_milestone = {}

        for line in milestone_lines:
            if '|' in line and 'Duration' in line:
                if current_milestone:
                    milestones.append(current_milestone)
                milestone_index, rest = line.split('. ', 1)
                title, duration = rest.split(' | Duration: ', 1)
                current_milestone = {
                    'index': int(milestone_index.strip()),
                    'title': title.strip(),
                    'time': int(duration.strip()),
                    'description': '',
                    'roles': [],
                    'deliverables': []
                }
            elif line.startswith('Deliverables:'):
                deliverables = line.split(':', 1)[1].strip().split(', ')
                current_milestone['deliverables'] = deliverables
            elif line.startswith('Roles:'):
                roles = line.split(':', 1)[1].strip().split(', ')
                current_milestone['roles'] = roles
            else:
                current_milestone['description'] += line.strip() + ' '

        if current_milestone:
            milestones.append(current_milestone)

        return milestones

    def convert_milestones_to_plain_text(self, milestones):
        lines = []
        for milestone in milestones:
            lines.append(f"{milestone['index']}. {milestone['title']} | Duration: {milestone['time']}")
            lines.append(milestone['description'].strip())
            lines.append(f"Deliverables: {', '.join(milestone['deliverables'])}")
            lines.append(f"Roles: {', '.join(milestone['roles'])}")

        return '\n'.join(lines)
