class HouseError(Exception):
    """A house that cannot be used as written — the message says where and why."""


class NotYet(Exception):
    """A verb this release declares but does not build yet; the message names the release."""
