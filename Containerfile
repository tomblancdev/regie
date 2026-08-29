# La Régie as an image — a house with no Python and no ansible runs the
# engine with podman alone:
#   podman run --rm -v "$PWD:/house" ghcr.io/tomblancdev/regie check /house/home.yml
# The base is pinned by digest: a rebuild cannot quietly change under a tag.
FROM docker.io/library/python:3.13-slim@sha256:7ce4b6dfe35e55397b7cda544f8a13f191b7ae28dc5aad71fe664dbc9bc2623f

ARG VERSION=dev
LABEL org.opencontainers.image.title="La Régie" \
      org.opencontainers.image.description="a smart home as files — one engine lays a Home Assistant brain down from home.yml" \
      org.opencontainers.image.source="https://github.com/tomblancdev/regie" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION}"

WORKDIR /src
COPY pyproject.toml README.md LICENSE ./
COPY src ./src
COPY examples ./examples
RUN pip install --no-cache-dir . && cp -r examples /usr/share/regie-examples && rm -rf /src

USER 65532:65532
WORKDIR /house
ENTRYPOINT ["regie"]
CMD ["--help"]
