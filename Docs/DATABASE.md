
# WEB APPLICATION DATABASE

___

## Steps For Setting Up A Database

### 1. Create your database
 - use chosen DBMS to create db and define tables and realtionships based on the data schema

### 2. Set up database server

- set up Acho account to host database and set up necessary software and configurations

### 3. Connect database to the web app
- use a programming language and a db driver or ORM to connect web app to db

### 4. Create data access layer
- create a layer of code that handles interactions between web app and db (this can include creating, reading, updating and deleting data)

### 5. Implement security measures
- protect db by implementing security measures like user authentication and encription

### 6. Optimize your database
- optimize db for performance by indexing your data and tuning your DBMS settings

### 7. Test your database
- use testing tools to ensure that db works as expected and can handle the expected workload

### 8. Backup and restore database
- regularly back up db to prevent data loss in case of an unexpected event
- have a plan in place to restore db from backup if needed

_____

## Create The Database

### Database Management System (DBMS)

- postgreSQL

### Data Schema

What data does the app needs to store and how should it be organized:

#### USER TABLE

	1.	id
	2.	username
	3.	email-address
	4.	password
	5.	friends (list)
	6.	game history (stores everything that happened during a game)
	7.	match history (history of completed games)
	8.	statistics -> not nessescary? postgre does it with existing data? or too expensive to calculate every time
	9.	chat history
	10.	customizations [board color, ball color of own and opponent, dark/light mode, avatar]
	11.	last_seen time stamp (opt.)

	(User status online/offline via redis or in-memory map? => not in db)

#### GAME HISTORY TABLE

	1.	Move
	2.	Player
	3.	x coordinate
	4.	y coordinate
	5.	z coordinate
	6.	Time

Example:

	Move	|	Player		|	X	|	Y	|	Z	|	Time	

	1		|	Bob (ID)	|	0	|	0	|	1	|	18:20:42

#### MATCH HISTORY TABLE

	1.	Match ID
	2.	Player A/1
	3.	Player B/2
	4.	Winner
	5.	Duration (opt.)
	6.	Total moves (opt.)
	7.	Played at

Example:

	Match ID	|	Player 1	|	Player 2	|	Winner		|	Duration	|	Total Moves	|	Played At

	101			|	Bob (ID)	|	Allen (ID)	|	Bob (ID)	|	4:42		|	12			|	30-06-2026
																									18:20:42

#### STATISTICS TABLE

	1.	Total Score
	2.	Wins
	3.	Losses
	4.	coins (in-game currency)

### Possible Structure For Passing Match Data

```bash
struct match{
	int player A;
	int player B;
	void time;
	void date;
	vector <move> moves;
};

struct move{
	char player; // or player ID
	int x;
	int y;
	int z;
};
```
## C. Export Database

### Export schema + data
```bash
sudo -u postgres pg_dump --no-owner -d ttt_db > schemaAndData.sql
# --no-owner -> otherwise postgres is assigned as owner and ttt_user gets permission errors
```

### Export schema only
```bash
sudo -u postgres pg_dump --no-owner -d ttt_db --schema-only > schema.sql
```

### Export data only
```bash
sudo -u postgres pg_dump --no-owner -d ttt_db --data-only > seed.sql 
```



