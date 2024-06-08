
import duckdb from "duckdb";

const db = new duckdb.Database("./knowledge.duck");
const con = db.connect();

//
//
//
//
const keyword_search = async (keywords) => {
	const query = (keywords) => {
		return new Promise((resolve, reject) => {
			con.all(
				`
				SELECT id, content, score
				FROM ( SELECT *, fts_main_knowledge.match_bm25( id, ? ) AS score FROM knowledge ) sq
				WHERE score IS NOT NULL
				ORDER BY score DESC
				LIMIT 1;`,
				[keywords],
				(err, rows) => {
					if (err) reject(err);
					else resolve(rows);
				},
			);
		});
	};

	try {
		return await query(keywords);
	} catch (err) {
		console.error(err);
		return;
	}
};


//
//
//
//
//
try {
	const results = await Promise.all([
		await keyword_search("garantie"),
		await keyword_search("locataire"),
		await keyword_search("bailleurs"),
		await keyword_search("action"),
		await keyword_search("logement"),
		await keyword_search("undefined"),
	]);

	console.log("RESULTS: ", results);
} catch (e) {
	console.log(e);
}