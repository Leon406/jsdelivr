# andres.gradle

## root project build.gradle

```
dependencies {

   classpath 'com.tencent.mm:AndResGuard-gradle-plugin:1.2.17'
}
```

## module  build.gradle

```
apply from: "https://cdn.jsdelivr.net/gh/Leon406/jsdelivr/gradle/andres.gradle"
```



## 执行task

```
gradlew :{module_name}:resgR
```

