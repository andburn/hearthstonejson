#!/usr/bin/env python

import sys
import boto3
from pprint import pprint


def update_website_configuration(s3, bucket, build):
	print("Querying website configuration for %r" % (bucket))
	config = s3.get_bucket_website(Bucket=bucket)
	pprint(config)

	if "ResponseMetadata" in config:
		del config["ResponseMetadata"]

	redir = "v1/%i" % (build)

	config["RoutingRules"] = [{
		"Condition": {
			"KeyPrefixEquals": "v1/latest/"
		},
		"Redirect": {
			"ReplaceKeyPrefixWith": redir + "/",
			"HttpRedirectCode": "302",
			"Protocol": "https",
		},
	}]

	# config["Redirect"] = {"ReplaceKeyPrefixWith": redir}

	print("Updating website configuration")
	pprint(config)

	s3.put_bucket_website(Bucket=bucket, WebsiteConfiguration=config)


def main():
	build = int(sys.argv[1])
	bucket = "api.hearthstonejson.com"
	s3 = boto3.client("s3")
	update_website_configuration(s3, bucket, build)


if __name__ == "__main__":
	main()
