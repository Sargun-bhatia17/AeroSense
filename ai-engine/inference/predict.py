import json
import sys
import random

def get_best_time(persona, activity):
    """
    Generates a mock best time to go out based on persona and activity.
    """
    # In a real scenario, this would load a model and perform inference.
    # For now, we'll return a mock response.

    times = ["6-8 AM", "8-10 AM", "4-6 PM", "6-8 PM"]
    best_time = random.choice(times)
    confidence = round(random.uniform(0.7, 0.95), 2)
    narrative = f"Based on the forecast for an {persona} doing {activity}, the air quality is expected to be best around {best_time}."

    return {
        "bestWindow": best_time,
        "confidence": confidence,
        "reason": narrative,
    }

if __name__ == "__main__":
    persona = sys.argv[1] if len(sys.argv) > 1 else "general"
    activity = sys.argv[2] if len(sys.argv) > 2 else "any"
    result = get_best_time(persona, activity)
    print(json.dumps(result))
