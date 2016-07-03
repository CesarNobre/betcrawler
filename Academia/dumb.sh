OIFS=$IFS;
IFS=",";

# fill in your details here
dbname=betcrawler
host=127.0.0.1:27017

# first get all collections in the database
collections=`mongo betcrawler --eval "rs.slaveOk();db.getCollectionNames();"`;
collectionArray=($collections);

# for each collection
for ((i=0; i<${#collectionArray[@]}; ++i));
do
    echo 'exporting collection' ${collectionArray[$i]}
    # get comma separated list of keys. do this by peeking into the first document in the collection and get his set of keys
    keys=`mongo betcrawler --eval "rs.slaveOk();var keys = []; for(var key in db.${collectionArray[$i]}.find().sort({_id: -1}).limit(1)[0]) { keys.push(key); }; keys;" --quiet`;
    # now use mongoexport with the set of keys to export the collection to csv
    mongoexport -d betcrawler -c ${collectionArray[$i]} --fields "$keys" --csv --out $dbname.${collectionArray[$i]}.csv;
done

IFS=$OIFS;