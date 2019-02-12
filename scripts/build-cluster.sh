#!/bin/bash
sudo chown -R guenter ~/dev/cluster/product/server && \
cd ~/dev/cluster/building && \
( ( ./gradlew clean cleanIdea && ./gradlew --parallel idea && ./gradlew idea --parallel -PfetchGwt && ./gradlew ui:angular:angular.server:assemble) || ( echo "FAIL" ) ) && \
# cd ~/dev/cluster/ui/angular/angular.server && \
# yarn install && \
cd ~/dev/cluster/building && \
# ./gradlew :ui:angular:angular.model:generateTypescript && \
echo "✓✓✓" && pwd && echo "✓✓✓" && echo "✓✓✓ gradlew :ui:angular" && echo "✓✓✓" && \
cd ~/dev/cluster/ui/angular/angular.server && \
#gnome-terminal -e  "bash -c \"yarn start-ssl\"" && \
#echo "✓✓✓" && pwd && echo "✓✓✓" && echo "✓✓✓ yarn start" && echo "✓✓✓" && \
cd ~/dev/cluster/building && \
rm -rf ~/dev/cluster/product/server/build/distributions/product-server.zip && \
rm -rf ~/dev/cluster/product/server/build/distributions/product-server && \
rm -rf ~/dev/cluster/product/server/bin/product-server && \
rm -rf ~/dev/cluster/product/server/lib && \
./gradlew distZip -PfetchGwt && \
echo "✓✓✓" && pwd && echo "✓✓✓" && echo "✓✓✓ gradlew distZip" && echo "✓✓✓" && \
cd ~/dev/cluster/product/server/build/distributions && \
unzip ./product-server.zip && \
echo "✓✓✓" && pwd && echo "✓✓✓" && echo "✓✓✓ unzip" && echo "✓✓✓" && \
cp ./product-server/bin/product-server ~/dev/cluster/product/server/bin/product-server && \
cp -R ./product-server/lib ~/dev/cluster/product/server && \
echo "✓✓✓" && pwd && echo "✓✓✓" && echo "✓✓✓ copy" && echo "✓✓✓" && \
#cd ~/dev/cluster/ui/angular/angular.server && yarn install && \
sudo chown -R guenter ~/dev/cluster/product/server && \
#cd ~/dev/docker/cluster && \
#sudo docker-compose up && \
echo "✓✓✓ DONE ✓✓✓" && read