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
  bremseskift: {
    p1: 'Bremseskift dækker udskiftning af slidte bremsedele, så du får fuld opbremsning tilbage. Vi monterer nye klodser eller bremsesko, skifter tærede eller strakte bremsewirer og justerer bremsen, så den griber blødt og sikkert – uanset om du har fælgbremser, skivebremser eller fodbremse.',
    h2: 'Når bremsen føles slap',
    p2: 'Skal du klemme håndtaget helt ind til styret, hyler bremsen, eller trækker cyklen skævt, når du bremser, er det tid til nye dele. Bremserne er det vigtigste på cyklen, og vi går aldrig på kompromis med dem. Book tid online, så er cyklen ofte klar igen samme dag.',
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
  bremseklodser: {
    p1: 'Bremseklodser er en sliddel, der skal skiftes med jævne mellemrum. Vi monterer nye klodser, der passer til netop din bremse, og justerer dem, så de rammer fælgen eller skiven korrekt og giver fuld, jævn opbremsning uden at slæbe.',
    h2: 'Hør efter metallyden',
    p2: 'Piber eller skurrer bremsen, eller kan du se, at gummiet er slidt ned til slidmarkeringen, skal klodserne skiftes – venter du, slider metal mod fælg og ødelægger den. Vi har klodser til de fleste cykler på lager og kan ofte skifte dem med det samme på værkstedet.',
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
  'montering-cykelkurv': {
    p1: 'Vi monterer din nye cykelkurv, så den sidder solidt og sikkert – uanset om det er en frontkurv på styret, en fastspændt kurv over forhjulet eller en kurv på bagagebæreren. Vi sikrer, at kurven ikke gnider mod hjul eller kabler og ikke rasler løs, når du kører over brosten.',
    h2: 'Kurv med eller uden beslag',
    p2: 'Har kurven brug for et særligt beslag eller en adapter til din styrtype, finder vi den rigtige løsning. Køber du kurven hos os, monterer vi den ofte med det samme. Kom forbi værkstedet på Nørrebrogade 74, eller book tid online.',
  },
  'montering-barnestol': {
    p1: 'En barnestol skal sidde helt fast og korrekt – der er ingen slinger i valsen, når det handler om at have barnet med. Vi monterer barnestolen efter forskrifterne, spænder beslag og fæste ordentligt og kontrollerer, at stolen sidder stabilt og ikke er i vejen for ben, bremser eller hjul.',
    h2: 'Tryghed for både barn og forælder',
    p2: 'Vi tjekker, at din cykel passer til stolen, og at vægtgrænserne overholdes, og viser dig, hvordan sele og fodstøtter justeres til barnet. Er du i tvivl om for- eller bagmontering, rådgiver vi ud fra din cykel. Book tid online på værkstedet på Nørrebro.',
  },
  'montering-bagagebaerer': {
    p1: 'En bagagebærer gør cyklen langt mere brugbar til hverdag – til tasken, kurven, barnestolen eller indkøbet. Vi monterer bagagebæreren solidt på stellet med de rigtige beslag, så den kan bære fuld last uden at rasle eller flytte sig.',
    h2: 'Passer til din cykel',
    p2: 'Alle cykler er ikke ens, så vi finder den rigtige bagagebærer og de beslag, der passer til netop dit stel og dine huller. Skal der også monteres kurv eller barnestol ovenpå, klarer vi det i samme ombæring. Kig forbi værkstedet på Nørrebrogade 74.',
  },
  'montering-skaerme': {
    p1: 'Skærme holder vejvand, mudder og skidt væk fra tøj og ryg og gør cyklen brugbar i al slags vejr. Vi monterer for- og bagskærme, der passer til dine dæk og dit stel, og justerer afstanden, så de ikke gnider mod hjulet eller klaprer, når du kører.',
    h2: 'Slut med den våde stribe op ad ryggen',
    p2: 'Vi sikrer, at stænklapper og stivere sidder fast, og at skærmene flugter pænt med hjulet hele vejen rundt. Har din cykel begrænset plads mellem dæk og stel, finder vi skærme, der passer. Book tid online på værkstedet på Nørrebro.',
  },
  'montering-lygter': {
    p1: 'Lys er lovpligtigt, når det er mørkt, og livsvigtigt i trafikken. Vi monterer dine for- og baglygter, så de lyser i den rigtige vinkel og sidder fast, hvad enten det er batterilygter, genopladelige lygter eller fastmonteret dynamolys.',
    h2: 'Se og bliv set',
    p2: 'Skal du have dynamolys, trækker vi ledningerne pænt og skjult langs stellet og tester, at lyset virker i både for- og bagende. Vi rådgiver om godt, kraftigt lys, der holder. Kom forbi værkstedet på Nørrebrogade 74, eller book tid online.',
  },
  'montering-laas': {
    p1: 'En fastmonteret ringlås eller rammelås er den nemme hverdagslås, du aldrig glemmer hjemme. Vi monterer låsen solidt på stellet, så den sidder fast og ikke gnider mod dæk eller eger, og sikrer, at den låser og låser op, som den skal.',
    h2: 'God sikring mod cykeltyveri',
    p2: 'Vi rådgiver om forsikringsgodkendte låse og om kombinationen af rammelås og en solid bøjlelås eller kædelås, der giver den bedste beskyttelse i byen. Køber du låsen hos os, monterer vi den ofte med det samme på Nørrebro. Book eventuelt tid online.',
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
