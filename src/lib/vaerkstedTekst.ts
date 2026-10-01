// ============================================================
// Servicespecifik brødtekst til værkstedssiderne (SEO + indeksering).
// Sanitys beskrivelse-felt er tyndt/tomt på mange ydelser, hvilket gør
// siderne for indholdsløse til at Google vil indeksere dem. Her ligger
// 2+ afsnit unik, konkret tekst pr. ydelse, keyed på slug.
//
// Rækkefølgen på siden: p1 (intro) → h2 (underoverskrift) → p2.
// Har en slug ingen tekst her, falder [slug].astro tilbage til Sanitys
// PortableText-beskrivelse. Redigér frit – teksten er redaktionelt indhold.
// ============================================================

export interface VaerkstedArtikel {
  p1: string;
  h2: string;
  p2: string;
}

export const vaerkstedTekst: Record<string, VaerkstedArtikel> = {
  serviceeftersyn: {
    p1: 'Et serviceeftersyn hos Cykelmov er en grundig gennemgang af hele cyklen, hvor vi finder de fejl, du måske ikke selv opdager, før de bliver dyre. Vi tjekker og justerer gear, bremser, kæde, hjul og lygter, strammer det, der har løsnet sig, og smører de bevægelige dele, så cyklen kører let og sikkert igen.',
    h2: 'Hvornår har du brug for det?',
    p2: 'Mærker du, at gearene hopper, bremserne føles slappe, eller kæden knirker, er det tid til et eftersyn. Du får altid en ærlig melding om, hvad der trænger nu, og hvad der kan vente – og skal der skiftes sliddele, hører du prisen, før vi går i gang. De fleste eftersyn klarer vi samme dag på værkstedet på Nørrebrogade 74.',
  },
  'stort-service': {
    p1: 'Stort service er vores mest omfattende gennemgang og svarer til et årligt hovedeftersyn af cyklen. Vi går alle bevægelige dele igennem, justerer gear og bremser fra bunden, strammer krankleje, styrfitting og hjul, renser og smører drivlinjen og slutter af med et komplet sikkerhedstjek.',
    h2: 'Til cyklen der bruges hele året',
    p2: 'Kører du på cyklen hver dag, året rundt, er stort service den billige forsikring mod nedbrud og dyre følgeskader. Vi anbefaler det én gang om året – typisk om foråret, inden sæsonen for alvor går i gang. Book tid online, så står cyklen klar igen som ny, ofte inden for en dag.',
  },
  sikkerhedstjek: {
    p1: 'Et sikkerhedstjek er et hurtigt, men grundigt eftersyn af de dele, der betyder mest for din sikkerhed: bremser, gear, hjul, dæk og lygter. På cirka 20 minutter får du at vide, om cyklen er sikker at køre på, eller om noget bør udbedres først.',
    h2: 'Perfekt inden ferien eller efter vinterpausen',
    p2: 'Har cyklen stået stille hele vinteren, eller skal I på cykelferie, er sikkerhedstjekket den lille investering, der giver ro i maven. Vi peger på det, der eventuelt trænger, uden at sælge dig mere end nødvendigt. Kig forbi værkstedet på Nørrebro – ofte kan vi tage den med det samme.',
  },
  gearjustering: {
    p1: 'Når gearene hopper, larmer eller ikke vil skifte helt op eller ned, er det som regel et spørgsmål om justering. Vi finindstiller gearskifter, wire og bagskifter, så kæden lægger sig præcist på hvert tandhjul, og skiftet bliver blødt og lydløst igen.',
    h2: 'Både udvendige og indvendige gear',
    p2: 'Vi justerer både klassiske udvendige gear og indvendige navgear som Shimano Nexus. Er wiren tæret eller strakt, skifter vi den, så justeringen holder. De fleste gearjusteringer klarer vi, mens du venter, eller samme dag – book tid online på Nørrebrogade 74.',
  },
  'stramning-af-bremser': {
    p1: 'Er bremsen blevet blød, eller tager det for langt at bremse, er det ofte bare et spørgsmål om opstramning. Vi strammer bremsewiren op og justerer klodserne, så bremsen griber tidligt og fast igen – uden at skulle skifte dele.',
    h2: 'Hurtigt og billigt',
    p2: 'Stramning er den lille, billige justering, der gør en mærkbar forskel i hverdagen og i trafikken. Er klodserne derimod slidt helt ned, anbefaler vi et bremseskift i stedet og siger det med det samme. Ofte klarer vi stramningen, mens du venter på Nørrebrogade 74.',
  },
  bremseskift: {
    p1: 'Bremseskift dækker udskiftning af slidte bremsedele på én bremse – for eller bag – så du får fuld opbremsning tilbage. Vi monterer nye klodser eller bremsesko, skifter tærede eller strakte bremsewirer og justerer bremsen, så den griber blødt og sikkert, uanset om du har fælgbremser, skivebremser eller fodbremse.',
    h2: 'Når bremsen føles slap',
    p2: 'Skal du klemme håndtaget helt ind til styret, hyler bremsen, eller trækker cyklen skævt, er det tid til nye dele. Skal begge bremser skiftes, gør vi det samlet til en fast pakkepris, og trænger bremsen bare til at blive strammet op, klarer vi det hurtigt og billigt. Book tid online, så er cyklen ofte klar igen samme dag.',
  },
  'bremseskift-begge-bremser': {
    p1: 'Skal både for- og bagbremse skiftes, får du det hele gjort samlet til én fast pakkepris. Vi monterer nye klodser eller bremsesko på begge bremser, skifter tærede wirer og justerer, så cyklen bremser ens og sikkert i begge ender.',
    h2: 'Begge bremser, én fast pris',
    p2: 'Det er typisk billigere at få skiftet begge bremser på én gang end at tage dem hver for sig – og du er sikker på, at hele cyklens opbremsning er i topform. Vil du kun have skiftet den ene, finder du Bremseskift, én bremse som separat ydelse. Book tid online på Nørrebrogade 74.',
  },
  kaedeskift: {
    p1: 'En slidt kæde ødelægger langsomt de dyre tandhjul på kassette og klinge. Ved et kædeskift måler vi kædens slid, monterer en ny kæde i den rigtige længde og kontrollerer, at den spiller sammen med resten af drivlinjen, så gearskiftet bliver skarpt igen.',
    h2: 'Skift kæden i tide',
    p2: 'En kæde skiftet i tide koster en brøkdel af en ny kassette og klinge. Skifter du for sent, kan den nye kæde hoppe på de nedslidte tandhjul, og så skal der mere til. Er du i tvivl om, hvornår din kæde trænger, måler vi den, når du kommer forbi værkstedet på Nørrebro.',
  },
  'kaede-og-drivlinjerens': {
    p1: 'Sod, vejsalt og gammel olie sætter sig som en slibende pasta på kæde, kassette og krank og slider drivlinjen ned før tid. Ved en drivlinjerens afmonterer og renser vi kæde, tandhjul og krank grundigt og smører bagefter med den rigtige olie til årstiden.',
    h2: 'Blødere gearskifte og længere levetid',
    p2: 'En ren og korrekt smurt drivlinje kører lettere, larmer mindre og holder markant længere. Det er en billig vane, der forlænger tiden mellem dyre kæde- og kassetteskift. Kombinér den gerne med et serviceeftersyn – book online på Nørrebrogade 74.',
  },
  slangeskift: {
    p1: 'Er slangen sprunget, og kan punkteringen ikke lappes, monterer vi en ny slange i den rigtige størrelse. Vi tjekker samtidig dækket indvendigt for det, der forårsagede punkteringen – glasskår, en søm eller et slidt dæk – så du ikke punkterer igen på vej hjem.',
    h2: 'Hurtigt fikset, ofte mens du venter',
    p2: 'De fleste slangeskift klarer vi, mens du venter, så du hurtigt er på hjulene igen. Kan skaden repareres, tilbyder vi lapning som en billigere løsning. Kig forbi værkstedet på Nørrebrogade 74 – du er også velkommen til at ringe først.',
  },
  punkteringslapning: {
    p1: 'Ved en punkteringslapning finder vi hullet, renser området og sætter en holdbar lap, så du undgår at købe en ny slange. Vi kontrollerer også dæk og fælgbånd for årsagen til punkteringen, så problemet ikke gentager sig.',
    h2: 'Den billige og grønne løsning',
    p2: 'Kan slangen repareres, er lapning både billigere og mere miljøvenligt end en ny. Er hullet for stort eller sidder ved ventilen, anbefaler vi i stedet en ny slange og siger det med det samme. Vi lapper typisk på et kvarter, mens du venter på Nørrebro.',
  },
  daekskift: {
    p1: 'Slidte dæk med lav profil punkterer oftere og skrider i regn og løv. Ved et dækskift monterer vi nye dæk i den rigtige størrelse, kontrollerer fælg og fælgbånd og tjekker slangen, så du får fuldt greb og færre punkteringer tilbage.',
    h2: 'Vælg det rigtige dæk',
    p2: 'Vi rådgiver om dæktype efter din kørsel – ekstra punkteringssikre bydæk, dæk med refleks efter dansk lov eller dæk med greb til grus og skovsti. Har vi dit dæk på lager, skifter vi det ofte samme dag. Book tid online på værkstedet på Nørrebrogade 74.',
  },
  'daek-og-slange': {
    p1: 'Skal dækket skiftes, er slangen næsten altid værd at skifte med det samme – den er alligevel afmonteret, og en gammel slange i et nyt dæk punkterer let igen. Med denne pakke får du både nyt dæk og ny slange monteret samlet til én fast pris.',
    h2: 'Dæk og slange i ét hug',
    p2: 'Vi vælger dæk og slange i den rigtige størrelse til din cykel, kontrollerer fælg og fælgbånd og sender dig af sted med fuldt greb og ro i maven. Vil du kun have skiftet det ene, finder du Slangeskift og Dækskift som separate ydelser. Book tid online på værkstedet på Nørrebrogade 74.',
  },
  hjulopretning: {
    p1: 'Slår hjulet fra side til side, gnider mod bremsen eller har fået et "ottetal" efter et kantstenshop, kan det oftest rettes op. Vi finindstiller egernes spænding, så hjulet kører rundt og lige igen, og kontrollerer samtidig, at ingen eger er knækket eller løse.',
    h2: 'Undgå at et skævt hjul bliver værre',
    p2: 'Et skævt hjul slider skævt på bremseklodser og dæk og bliver kun værre med tiden. Bliver hjulet rettet i tide, undgår du som regel at skulle bygge et helt nyt. Kom forbi værkstedet på Nørrebro, så vurderer vi, om hjulet kan reddes.',
  },
  'elcykel-service': {
    p1: 'Elcykel service dækker både den mekaniske og den elektriske del af cyklen. Vi går gear, bremser, kæde og hjul igennem som ved et almindeligt service og kontrollerer derudover motor, batteri, kabler og display for fejl og slid.',
    h2: 'Specialviden om elcykler',
    p2: 'En elcykel kører flere kilometer og med mere vægt end en almindelig cykel, så bremser og drivlinje slides hurtigere og bør efterses oftere. Vi kender de gængse motorsystemer og giver dig besked, hvis noget bør udbedres. Book tid online – større opgaver tager typisk en til to dage.',
  },
  batteritest: {
    p1: 'Får du kortere og kortere rækkevidde på din elcykel, kan en batteritest afsløre, om batteriet er ved at være slidt op, eller om problemet ligger et andet sted. Vi måler batteriets faktiske kapacitet og sundhed og sammenligner med, hvad det skal kunne som nyt.',
    h2: 'Få klarhed før du køber nyt',
    p2: 'Et nyt batteri er en stor udgift, så det er godt at vide, om det er batteriet eller fx motoren, der driller, inden du investerer. Vi giver dig en klar melding om batteriets tilstand og forventede levetid. Kig forbi værkstedet på Nørrebrogade 74.',
  },
  softwareopdatering: {
    p1: 'Ligesom en telefon får elcyklens motorsystem løbende opdateringer fra producenten. En softwareopdatering kan forbedre motorens ydelse, batteristyring og rækkevidde og rette fejl, der får motoren til at sætte ud eller vise fejlkoder på displayet.',
    h2: 'Hvis din motor understøtter det',
    p2: 'Vi opdaterer motor og system på de mærker, hvor producenten stiller opdateringer til rådighed. Oplever du fejlkoder, ujævn understøttelse eller uventet strømforbrug, er en opdatering ofte det første, vi prøver. Book tid online, så tjekker vi, om der er en opdatering klar til din cykel.',
  },
  vinterklargoering: {
    p1: 'Vinterklargøring beskytter cyklen mod salt, fugt og kulde, så den holder til at blive brugt hele den mørke sæson. Vi renser og smører drivlinjen med vinterolie, der ikke skylles væk, tjekker bremser og dæk til glat føre og sikrer, at lyset virker.',
    h2: 'Kør trygt gennem vinteren',
    p2: 'Salt og fugt er cyklens værste fjender og tærer især på kæde, wirer og bremser. En vinterklargøring holder rusten væk og sparer dig for dyre reparationer til foråret. Book tid online på værkstedet på Nørrebrogade 74.',
  },
  'eftersyn-lille-service': {
    p1: 'Lille service er det oplagte eftersyn mellem de store. Vi justerer gear og bremser, strammer det, der har løsnet sig, smører kæden og kontrollerer hjul, dæk og lygter, så cyklen kører let og sikkert i hverdagen.',
    h2: 'Den løbende vedligeholdelse',
    p2: 'Passer du cyklen med et lille service et par gange om året, holder de dyre dele længere, og du undgår de pludselige nedbrud. Vi siger til, hvis noget større trænger, men sælger dig aldrig mere end nødvendigt. Book tid online på Nørrebro.',
  },
  'kaede-rustfri-skift': {
    p1: 'Er kæden rustet efter regn og vinter, bliver gearskiftet trægt, og kæden risikerer at hoppe eller knække. Ved et kædeskift til en rustfri kæde fjerner vi den gamle, tærede kæde og monterer en ny kæde, der er bedre beskyttet mod rust og fugt.',
    h2: 'Slut med den rustne, knirkende kæde',
    p2: 'Vi måler samtidig, om kassette og klinge har taget skade af den slidte kæde, og smører den nye kæde med olie, der holder rusten væk. Så kører gearene blødt og lydløst igen. Book tid online på værkstedet på Nørrebrogade 74.',
  },
};
