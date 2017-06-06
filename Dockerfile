FROM python:3.5-alpine

ENV PRJ=/prj

WORKDIR $PRJ

RUN pip install bottle

COPY . .

EXPOSE 8080

CMD ["python", "cli.py"]
