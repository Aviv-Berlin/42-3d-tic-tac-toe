FROM postgres:17-trixie
COPY  ./conf/schema.sql /docker-entrypoint-initdb.d

# If you want to load a dumped database instead of a fresh init (schema.sql)
# copy that file instead. Example:
# COPY  ./conf/schemaAndData.sql /docker-entrypoint-initdb.d