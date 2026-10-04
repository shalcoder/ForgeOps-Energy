from .decision2_engine import Decision2Engine

_engine: Decision2Engine | None = None


def get_decision2_engine() -> Decision2Engine:
    """Share one optional local model instance across API requests and agent runs."""
    global _engine
    if _engine is None:
        _engine = Decision2Engine()
    return _engine


__all__ = ["Decision2Engine", "get_decision2_engine"]
