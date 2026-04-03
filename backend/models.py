from dataclasses import dataclass, asdict
from typing import Optional

@dataclass
class SlotOutcome:
    slot_id: int
    name: str
    sound_file: str
    is_multi_ball: bool = False
    value: Optional[int] = None

    def to_dict(self):
        return asdict(self)

SLOT_OUTCOMES = [
    SlotOutcome(slot_id=0, name="Low", sound_file="slot0.mp3", value=1),
    SlotOutcome(slot_id=1, name="Medium-", sound_file="slot1.mp3", value=2),
    SlotOutcome(slot_id=2, name="Medium", sound_file="slot2.mp3", value=5),
    SlotOutcome(slot_id=3, name="Medium+", sound_file="slot3.mp3", value=10),
    SlotOutcome(slot_id=4, name="MULTI-BALL!", sound_file="multiball.mp3", is_multi_ball=True, value=20),
    SlotOutcome(slot_id=5, name="Medium+", sound_file="slot5.mp3", value=10),
    SlotOutcome(slot_id=6, name="Medium", sound_file="slot6.mp3", value=5),
    SlotOutcome(slot_id=7, name="Medium-", sound_file="slot7.mp3", value=2),
    SlotOutcome(slot_id=8, name="High", sound_file="slot8.mp3", value=50),
]
