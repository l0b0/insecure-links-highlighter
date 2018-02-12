# Build
FROM python:3.6.4

ENV PATH /virtualenv/bin:$PATH
ENV VIRTUAL_ENV /virtualenv
RUN mkdir /virtualenv
RUN python -m venv /virtualenv
RUN pip install --no-cache-dir --upgrade pip

COPY python/requirements.txt .
RUN pip install --no-cache-dir --requirement requirements.txt

# Run
FROM python:3.6.4

COPY --from=0 /virtualenv /virtualenv/

ENV PATH /virtualenv/bin:$PATH
ENV VIRTUAL_ENV /virtualenv

WORKDIR /project

COPY . .
