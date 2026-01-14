#!/bin/sh
# Tunggu Kafka siap

KAFKA_HOST=${KAFKA_HOST:-kafka-dev}
KAFKA_PORT=${KAFKA_PORT:-9092}

echo "Menunggu Kafka di $KAFKA_HOST:$KAFKA_PORT..."

while ! nc -z $KAFKA_HOST $KAFKA_PORT; do
  echo "Kafka belum siap, mencoba lagi dalam 5 detik..."
  sleep 5
done

echo "Kafka sudah siap!"
