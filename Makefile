.EXPORT_ALL_VARIABLES:
ENV ?= dev

PROJECT_NAME := metamask-web-utils
ROOT_DIR := $(CURDIR)

FRONTEND_DIR := ${ROOT_DIR}

DISABLE_ESLINT_PLUGIN=true
SKIP_PREFLIGHT_CHECK=true

DOKKU_SSH_PROFILE ?= dokku.greate
DOKKU_APP ?= ${PROJECT_NAME}-${ENV}

code/check:
	@yarn run code:check

code/autofix:
	@yarn run code:fix

code/generate:
	@yarn run generate

icon/generate/%:
	inkscape ./src/logo.svg --export-filename ./public/logo$*.png --export-height $* --export-width $*

icon/generate:
	@make icon/generate/16
	@make icon/generate/32
	@make icon/generate/64
	@make icon/generate/192
	@make icon/generate/512
	convert ./public/logo16.png ./public/logo32.png ./public/logo64.png ./public/logo192.png ./public/logo512.png ./public/favicon.ico

run:
	@yarn run start

install:
	@yarn install

dokku/init:
	git remote add ${DOKKU_APP} ${DOKKU_SSH_PROFILE}:${DOKKU_APP} || true
	ssh ${DOKKU_SSH_PROFILE} apps:create ${DOKKU_APP} || true

	@echo "WARNING:be aware to link and GRAPHQL entpoint using the command 'make dokku/link/endpoint'"

dokku/link/endpoint:
	@read -p "Enter GraphQL URL: " URI \
	&& ssh ${DOKKU_SSH_PROFILE} config:set ${DOKKU_APP} REACT_APP_GQL_URI="$${URI}" --no-restart

dokku/enable/letsencrypt:
	ssh ${DOKKU_SSH_PROFILE} letsencrypt:enable ${DOKKU_APP}

dokku/remove:
	ssh ${DOKKU_SSH_PROFILE} apps:destroy ${DOKKU_APP} --force || true

dokku/logs:
	ssh ${DOKKU_SSH_PROFILE} logs ${DOKKU_APP}

dokku/deploy:
	git push ${DOKKU_APP} HEAD:master -f