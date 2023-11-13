package kms

const AppName string = "kms"
const DatabaseName string = "kms"

var ConfigurationFile string
var InstallDatabase string

const SolrV2AddURL string = "/solr/kms_article/update/json/docs"
const SolrV2SchemaAPI string = "/solr/kms_article/schema"
const SolrV2SchemaGetAPI string = "/kms_article/schema"
const Solrv2DeleteAddURL string = "/solr/kms_article/update"
const Solrv2DeleteAllAddURL string = "/solr/kms_article/update?stream.body=<delete><query>*:*</query></delete>&commit=true"
const SolrV2SelectAddURL string = "/solr/kms_article/select"
const TikaAddURL string = "/tika"
