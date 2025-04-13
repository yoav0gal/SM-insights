from typing import Dict, List, Optional
from .shared_state import ClusterData

MOCK_STC_RESULTS: List[ClusterData] = [
    {
        "label": "Technical Issues",
        "count": 45,
        "members": [
            "App crashes when uploading large files",
            "Can't connect to server during peak hours",
            "Login page freezes randomly"
        ],
        "subclusters": {
            "label": "Performance Issues",
            "count": 25,
            "members": [
                "Video playback is very laggy",
                "App becomes unresponsive after 30 minutes",
                "Memory usage is too high"
            ],
            "subclusters": None
        }
    },
    {
        "label": "User Experience",
        "count": 60,
        "members": [
            "Love the new dark mode feature!",
            "Interface is very intuitive",
            "Great accessibility options"
        ],
        "subclusters": {
            "label": "Design Feedback",
            "count": 35,
            "members": [
                "Modern and clean design",
                "Color scheme is perfect",
                "Icons are well-designed"
            ],
            "subclusters": None
        }
    },
    {
        "label": "Feature Requests",
        "count": 40,
        "members": [
            "Please add export to PDF option",
            "Need better search filters",
            "Would love to see integration with other tools"
        ],
        "subclusters": {
            "label": "Integration Requests",
            "count": 20,
            "members": [
                "Add Google Calendar sync",
                "Need Slack integration",
                "Support for Microsoft Teams would be great"
            ],
            "subclusters": None
        }
    },
    {
        "label": "Customer Support",
        "count": 35,
        "members": [
            "Quick response from support team",
            "Support staff was very knowledgeable",
            "Issue resolved in first contact"
        ],
        "subclusters": {
            "label": "Response Time",
            "count": 15,
            "members": [
                "Got help within minutes",
                "24/7 support is amazing",
                "No waiting time for chat support"
            ],
            "subclusters": None
        }
    }
]